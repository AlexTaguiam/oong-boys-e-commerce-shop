import { Request, Response } from "express";
import prisma from "../config/db";
import { ROLES } from "../constants/enums";
import { sendResponse } from "../utils/reponseHandler";



export const syncUser = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    sendResponse(res, 401, "Unauthorized: Missing user authentication context");
    return;
  }

  const { uid, email, name: firebaseName } = req.user;
  const { name: bodyName, phone, address } = req.body;

  if (!email) {
    sendResponse(
      res,
      400,
      "Bad Request: Firebase account is missing a valid email address",
    );
    return;
  }

  // Field validation is handled upstream by syncUserSchema + validate() middleware.

  // Prefer the verified token claim over client input for name —
  // client input is only a fallback for providers that don't supply a display name.
  // Some OAuth providers (e.g. Google without a display name) yield no name at all,
  // so fall back to the email's local-part to avoid persisting a blank name.
  // Users can later set a proper name from the profile page.
  const emailLocalPart = email.split("@")[0];
  const finalName =
    (firebaseName && firebaseName.trim()) ||
    (bodyName && bodyName.trim()) ||
    emailLocalPart ||
    "";

  try {
    const existingUser = await prisma.user.findUnique({
      where: { firebaseUid: uid },
    });

    const databaseUser = await prisma.user.upsert({
      where: { firebaseUid: uid },
      update: {
        name: finalName || undefined,
        phone: phone || undefined,
        address: address || undefined,
      },
      create: {
        firebaseUid: uid,
        email,
        name: finalName,
        phone: phone || null,
        address: address || null,
        role: ROLES[0],
      },
    });

    sendResponse(
      res,
      existingUser ? 200 : 201,
      existingUser
        ? "Logged in successfully."
        : "Account created successfully.",
      databaseUser,
    );
  } catch (error) {
    console.error("Prisma Auth Sync Error:", error);
    sendResponse(
      res,
      500,
      "Internal Server Error: Failed to synchronize user profile.",
    );
  }
};
