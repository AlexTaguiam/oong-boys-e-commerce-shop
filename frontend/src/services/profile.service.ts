import { api } from "../api/client";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * The persisted user profile as stored in the backend database.
 * Mirrors the Prisma `User` model (name is required in DB but may be an
 * email-derived fallback; phone/address are nullable).
 */
export interface DbUserProfile {
  firebaseUid: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  role: string;
  createdAt: string;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  address?: string;
}

/**
 * GET /api/users/me — fetch the authenticated user's profile record.
 */
export const getMyProfile = async (): Promise<ApiResponse<DbUserProfile>> => {
  const result = await api.get<ApiResponse<DbUserProfile>>("/users/me");
  return result.data;
};

/**
 * PATCH /api/users/me — update name / phone / address.
 * Pass "" for phone or address to clear it.
 */
export const updateMyProfile = async (
  payload: UpdateProfilePayload,
): Promise<ApiResponse<DbUserProfile>> => {
  const result = await api.patch<ApiResponse<DbUserProfile>>(
    "/users/me",
    payload,
  );
  return result.data;
};
