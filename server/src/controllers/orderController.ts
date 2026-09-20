import { Request, Response } from "express";
import prisma from "../config/db";
import { sendResponse } from "../utils/reponseHandler";

export const createOrder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Ensure the user context has been successfully verified via authentication middleware
    if (!req.user || !req.user.uid) {
      sendResponse(res, 401, "Unauthorized: Invalid authentication session.");
      return;
    }

    // Gets the data coming from the frontend (pre-validated and typed by Zod)
    const {
      items,
      deliveryAddress,
      contactPhone,
      paymentMethod,
      fulfillmentType,
    } = req.body;

    // Look up the database for the uid
    const databaseUser = await prisma.user.findUnique({
      where: { firebaseUid: req.user.uid },
    });

    if (!databaseUser) {
      sendResponse(res, 404, "Not Found: User record could not be resolved.");
      return;
    }

    const result = await prisma.$transaction(async (tx) => {
      let computedTotalAmount = 0;
      const verifiedItemDetails = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { productId: item.productId },
        });

        if (!product) {
          sendResponse(res, 404, "Product not found");
          return;
        }

        if (
          product.status !== "active" ||
          product.stockQuantity <= item.quantity
        ) {
          sendResponse(res, 400, "Insufficint amount of stacks ");
          return;
        }

        const itemSubtotal = Number(product.price) * item.quantity;
        computedTotalAmount += itemSubtotal;

        verifiedItemDetails.push({
          productId: product.productId,
          quantity: item.quantity,
          priceAtPurchase: product.price,
        });
      }

      const newOrder = await tx.order.create({
        data: {
          userId: databaseUser.firebaseUid,
          contactPhone, // 📸 Point-in-time snapshot from checkout form
          totalAmount: computedTotalAmount,
          status: "pending",
          fulfillmentType: fulfillmentType,
          deliveryAddress:
            fulfillmentType === "delivery"
              ? deliveryAddress || databaseUser.address || ""
              : null,
          paymentMethod: paymentMethod,
          // Need to update the logic of payment
          paymentStatus: "unpaid",

          orderItems: {
            create: verifiedItemDetails.map((detail) => ({
              productId: detail.productId,
              quantity: detail.quantity,
              priceAtOrder: detail.priceAtPurchase,
            })),
          },
        },
        include: {
          orderItems: true,
        },
      });

      // Update user profile if phone number has changed
      if (contactPhone && contactPhone !== databaseUser.phone) {
        await tx.user.update({
          where: { firebaseUid: databaseUser.firebaseUid },
          data: { phone: contactPhone },
        });
      }

      const paymentLog = await tx.payment.create({
        data: {
          orderId: newOrder.orderId,
          amount: computedTotalAmount,
          method: paymentMethod,
          status: "pending",
        },
      });
      return { order: newOrder, payment: paymentLog };
    });

    sendResponse(res, 201, "Order Placed Successfully!", {
      orderId: result?.order.orderId,
      totalAmount: result?.order.totalAmount,
      itemsCoumt: result?.order.orderItems.length,
      paymentStatus: result?.order.status,
    });
  } catch (error: any) {
    console.error(
      "Critical Transaction Checkout Failure: ",
      error.message || error,
    );
    sendResponse(
      res,
      400,
      error.message ||
        "An unhandled exception occurred during transaction verification.",
    );
  }
};

// const databaseUser = await prisma.user.findUnique({
//   where: { firebaseUid: req.user.uid },
// });

export const getOrders = async (req: Request, res: Response): Promise<void> => {
  console.log("Get orders", req.user);
  try {
    if (!req.user || !req.user.uid) {
      sendResponse(res, 401, "Unauthorized: Missing authentication token.");
      return;
    }

    const { uid, role } = req.user;
    const { status } = req.query;

    const whereClause: any = {};

    if (role === "admin") {
      if (status) {
        whereClause.status = status;
      }

      // Admin should not see (and therefore cannot confirm) orders where
      // online payment hasn't actually succeeded. COD orders are exempt —
      // "unpaid" is expected there since payment happens on delivery.
      whereClause.OR = [{ paymentMethod: "cod" }, { paymentStatus: "paid" }];
    } else {
      whereClause.userId = uid;

      if (status) {
        whereClause.status = status;
      }
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        orderItems: {
          select: {
            quantity: true,
            priceAtOrder: true,
            product: {
              select: {
                name: true,
                imageUrl: true,
              },
            },
          },
        },
        payment: {
          select: {
            method: true,
            status: true,
          },
        },
      },
      orderBy: {
        orderDate: "desc",
      },
    });

    // Flatten the customer identity onto the order for the admin table.
    // Fall back to email when the customer has no name yet (e.g. Google OAuth
    // signups that never completed their profile).
    const shapedOrders = orders.map((order) => {
      const { user, ...rest } = order;
      return {
        ...rest,
        userName: user?.name?.trim() || user?.email || null,
        userEmail: user?.email ?? null,
      };
    });

    sendResponse(res, 200, "Orders retrieved successfully", {
      count: shapedOrders.length,
      orders: shapedOrders,
    });
  } catch (error: any) {
    console.error("Unable to get orders ", error.message || error);
    sendResponse(
      res,
      400,
      error.message || "An unhandled exception occurred in getting orders.",
    );
  }
};

export const getOrderById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user || !req.user.uid) {
      sendResponse(res, 401, "Unauthorized: Missing authentication token.");
      return;
    }

    const { uid, role } = req.user;
    const { id } = req.params;
    const orderId = Number(id);

    console.log("Order ID:", orderId);

    if (isNaN(orderId)) {
      sendResponse(
        res,
        400,
        "Bad Request: Invalid format for target order ID identifier.",
      );
      return;
    }

    const whereClause: any = { orderId };

    if (role !== "admin") {
      whereClause.userId = uid;
    }

    const order = await prisma.order.findFirst({
      where: whereClause,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        orderItems: {
          select: {
            quantity: true,
            priceAtOrder: true,
            product: {
              select: { name: true, imageUrl: true },
            },
          },
        },
        payment: {
          select: { method: true, status: true },
        },
      },
    });

    if (!order) {
      sendResponse(
        res,
        404,
        "Not Found: The requested order record could not be resolved or access is restricted.",
      );
      return; // 👈 FIXED: Safely exits execution context
    }

    // Flatten customer identity, falling back to email when no name is set.
    const { user, ...rest } = order;
    const shapedOrder = {
      ...rest,
      userName: user?.name?.trim() || user?.email || null,
      userEmail: user?.email ?? null,
    };

    sendResponse(res, 200, "Order retrieved successfully", shapedOrder);
  } catch (error: any) {
    console.error(
      "Unable to capture order profile logs:",
      error.message || error,
    );
    sendResponse(
      res,
      400,
      error.message ||
        "An unhandled engine exception occurred while handling retrieval commands.",
    );
  }
};

export const confirmOrder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // 1. Guard Clause: Authenticate Session Context
    if (!req.user || !req.user.uid) {
      res
        .status(401)
        .json({ error: "Unauthorized: Missing authentication token." });
      return;
    }

    const { id } = req.params;
    const { role } = req.user;
    const orderId = Number(id);

    // Enforce role-based access control
    if (role !== "admin") {
      sendResponse(
        res,
        403,
        "Unauthorized: Only administrators can confirm orders.",
      );
      return;
    }

    // 2. Database Fetch: Secure the official order items directly from the database
    const targetOrder = await prisma.order.findUnique({
      where: { orderId },
      include: { orderItems: true }, // Pulls the official items array safely
    });

    // 3. State Guards: Verify order exists and is eligible for confirmation
    if (!targetOrder) {
      sendResponse(res, 404, "Not Found: Target order could not be located.");
      return;
    }

    if (targetOrder.status !== "pending") {
      sendResponse(
        res,
        400,
        `Bad Request: Cannot confirm this order. Current status is already '${targetOrder.status}'.`,
      );
      return;
    }

    // 4. Initialize Database Isolation Transaction
    await prisma.$transaction(async (tx) => {
      // Loop through the secured order items fetched from step 2
      for (const item of targetOrder.orderItems) {
        // Fetch the up-to-the-second stock level of the target product
        const product = await tx.product.findUnique({
          where: { productId: item.productId },
        });

        if (!product) {
          throw new Error(`PRODUCT_NOT_FOUND:${item.productId}`);
        }

        // Concurrency Stock Check
        if (product.stockQuantity < item.quantity) {
          throw new Error(`INSUFFICIENT_STOCK:${product.name}`);
        }

        const updatedStock = product.stockQuantity - item.quantity;

        // Execute Product Stock Level Adjustment
        await tx.product.update({
          where: { productId: item.productId },
          data: {
            stockQuantity: updatedStock,
            status: updatedStock === 0 ? "out_of_stock" : "active",
          },
        });

        // Audit Trail Tracking: Create the inventory log entry (No 'where' clause here!)
        await tx.inventoryLog.create({
          data: {
            productId: item.productId,
            changeType: "order_deduction",
            quantityChange: -item.quantity, // Stored as a negative value to reflect deduction
          },
        });
      }

      // 5. Final Lifecycle Writes: Update Main Order Lifecycle State
      await tx.order.update({
        where: { orderId },
        data: { status: "confirmed" },
      });

      // Optional: Update matching payment record if your schema uses a secondary tracker
      await tx.payment.updateMany({
        where: { orderId },
        data: { status: "confirmed" },
      });
    });

    // 6. Return Success Payload
    sendResponse(
      res,
      200,
      `Order #${orderId} confirmed successfully. Inventory stock levels updated.`,
    );
  } catch (error: any) {
    console.error("Unable to Confirm Order:", error.message || error);

    // Custom Error Router: Check if the transaction failed due to our explicit stock checks
    if (error.message.startsWith("INSUFFICIENT_STOCK:")) {
      const productName = error.message.split(":")[1];
      sendResponse(
        res,
        400,
        `Insufficient stock on hand for product: ${productName}. Transaction rolled back safely.`,
      );
      return;
    }

    if (error.message.startsWith("PRODUCT_NOT_FOUND:")) {
      sendResponse(
        res,
        404,
        "One or more items in the order point to a product that no longer exists.",
      );
      return;
    }

    // Standard Fallback catch-all for database drops or driver dropouts
    sendResponse(
      res,
      500,
      error.message ||
        "An unhandled execution exception occurred inside the transaction database engine.",
    );
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // 1. Guard Clause: Authenticate Session Context
    if (!req.user || !req.user.uid) {
      sendResponse(res, 401, "Unauthorized: Missing authentication token.");
      return;
    }

    const { role } = req.user;
    const { id } = req.params;
    const { status: targetStatus } = req.body; // The status the admin wants to change to

    // 2. Enforce role-based access control
    if (role !== "admin") {
      sendResponse(
        res,
        403,
        "Unauthorized: Only administrators can update order status.",
      );
      return;
    }

    // 3. Fetch the target order
    const order = await prisma.order.findUnique({
      where: { orderId: Number(id) },
    });

    if (!order) {
      sendResponse(res, 404, "Order not found.");
      return;
    }

    const currentStatus = order.status;
    const { fulfillmentType, paymentMethod } = order;

    // 4. Quick check: Is it already in the target status?
    if (currentStatus === targetStatus) {
      sendResponse(res, 400, `Order is already in '${targetStatus}' status.`);
      return;
    }

    // 5. The State Machine Guard Rail
    let isValidTransition = false;

    switch (currentStatus) {
      case "confirmed":
        if (targetStatus === "ready") isValidTransition = true;
        break;

      case "ready":
        if (
          fulfillmentType === "delivery" &&
          targetStatus === "out_for_delivery"
        ) {
          isValidTransition = true;
        } else if (
          fulfillmentType === "pickup" &&
          targetStatus === "completed"
        ) {
          isValidTransition = true;
        }
        break;

      case "out_for_delivery":
        if (targetStatus === "completed") isValidTransition = true;
        break;

      case "completed":
        // Once completed, it's locked down forever
        sendResponse(
          res,
          400,
          "Cannot modify an order that is already completed.",
        );
        return;

      default:
        sendResponse(res, 400, `Unhandled current status: ${currentStatus}`);
        return;
    }

    // If the requested status skipped a track step, reject it
    if (!isValidTransition) {
      sendResponse(
        res,
        400,
        `Invalid status track. Cannot move a ${fulfillmentType} order from '${currentStatus}' straight to '${targetStatus}'.`,
      );
      return;
    }

    // 6. Build dynamic data payload for the single update
    const updateData: any = { status: targetStatus };

    // Financial Log Sync: Auto-pay on package completion for Cash on Delivery
    if (targetStatus === "completed" && paymentMethod === "cod") {
      updateData.paymentStatus = "paid";
    }

    // 7. Execute the Single Database Mutation
    const updatedOrder = await prisma.order.update({
      where: { orderId: Number(id) },
      data: updateData,
    });

    sendResponse(
      res,
      200,
      `Order status successfully updated to ${targetStatus}.`,
      updatedOrder,
    );
  } catch (error: any) {
    console.error("Unable to update order status:", error.message || error);
    sendResponse(
      res,
      500,
      error.message || "An error occurred on the database engine level.",
    );
  }
};

export const cancelOrder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user || !req.user.uid) {
      sendResponse(res, 401, "Unauthorized: Missing authentication token.");
      return;
    }

    const { role, uid } = req.user;
    const { id } = req.params;

    const whereClause: any = { orderId: Number(id) };

    const order = await prisma.order.findUnique({
      where: { orderId: Number(id) },
    });

    if (!order) {
      sendResponse(res, 404, "Order not found.");
      return;
    }

    if (role !== "admin") {
      if (uid !== order?.userId) {
        sendResponse(res, 403, "Unauthorized: You do not own this order.");
        return;
      }
      whereClause.userId = uid;
    }

    const nonCancellableStatuses = new Set([
      "confirmed",
      "ready",
      "out_for_delivery",
      "completed",
    ]);

    if (nonCancellableStatuses.has(order.status)) {
      sendResponse(res, 400, "Order already confirmed and cannot be cancelled");
      return;
    }

    if (order.status === "cancelled") {
      sendResponse(res, 400, "order is already cancelled");
      return;
    }

    const completedCancellation = await prisma.order.update({
      where: whereClause,
      data: {
        // 1. Update overall order status
        status: "cancelled",

        // 2. Update summary field on the Order table directly
        paymentStatus: "cancelled",

        // 3. Update status on the related Payment record
        payment: {
          update: {
            where: {}, // Safely targets the 1:1 related record
            data: {
              status: "cancelled",
            },
          },
        },
      },
    });

    sendResponse(
      res,
      200,
      "Order Successfully cancelled.",
      completedCancellation,
    );
  } catch (error: any) {
    console.error("Unable to cancel order:", error.message || error);
    sendResponse(
      res,
      500,
      error.message || "An error occurred on the database engine level.",
    );
  }
};
