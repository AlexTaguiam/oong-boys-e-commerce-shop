import { Request, Response } from "express";
import prisma from "../config/db";
import { sendResponse } from "../utils/reponseHandler";

/**
 * GET /api/users/me
 * Returns the authenticated user's profile record from the database.
 */
export const getMe = async (req: Request, res: Response): Promise<void> => {
  if (!req.user || !req.user.uid) {
    sendResponse(res, 401, "Unauthorized: Missing authentication context.");
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { firebaseUid: req.user.uid },
    });

    if (!user) {
      sendResponse(res, 404, "Not Found: User profile has not been created yet.");
      return;
    }

    sendResponse(res, 200, "Profile retrieved successfully.", user);
  } catch (error) {
    console.error("Prisma Get Profile Error:", error);
    sendResponse(
      res,
      500,
      "Internal Server Error: Failed to retrieve user profile.",
    );
  }
};

/**
 * PATCH /api/users/me
 * Updates the authenticated user's name, phone, and/or address.
 * Email and role are intentionally NOT editable here.
 */
export const updateProfile = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user || !req.user.uid) {
    sendResponse(res, 401, "Unauthorized: Missing authentication context.");
    return;
  }

  // Field validation is handled upstream by updateProfileSchema + validate().
  const { name, phone, address } = req.body as {
    name?: string;
    phone?: string;
    address?: string;
  };

  // Build a partial update payload. An empty string for phone/address is a
  // deliberate "clear" signal, so we map "" -> null; undefined means "leave as is".
  const updateData: {
    name?: string;
    phone?: string | null;
    address?: string | null;
  } = {};

  if (name !== undefined) updateData.name = name;
  if (phone !== undefined) updateData.phone = phone === "" ? null : phone;
  if (address !== undefined)
    updateData.address = address === "" ? null : address;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { firebaseUid: req.user.uid },
    });

    if (!existingUser) {
      sendResponse(
        res,
        404,
        "Not Found: User profile has not been created yet.",
      );
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { firebaseUid: req.user.uid },
      data: updateData,
    });

    sendResponse(res, 200, "Profile updated successfully.", updatedUser);
  } catch (error) {
    console.error("Prisma Update Profile Error:", error);
    sendResponse(
      res,
      500,
      "Internal Server Error: Failed to update user profile.",
    );
  }
};
