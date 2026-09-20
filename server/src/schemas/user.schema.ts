import { z } from "zod";

/**
 * Schema for PATCH /api/users/me
 *
 * Mirrors the field rules used by syncUserSchema so profile edits stay
 * consistent with the auth-sync path.
 *
 * - name:    1–100 chars when provided (cannot be blanked out).
 * - phone:   "" (explicit clear) | valid E.164-ish pattern.
 * - address: any string up to 300 chars; "" is an intentional "clear" signal.
 *
 * All fields optional so partial updates are allowed, but at least one field
 * must be present (enforced with .refine).
 */
export const updateProfileSchema = z.object({
  body: z
    .object({
      name: z
        .string({ message: "name must be a string" })
        .trim()
        .min(1, "name cannot be blank")
        .max(100, "name must be 100 characters or fewer")
        .optional(),

      phone: z
        .union([
          z.literal(""),
          z
            .string()
            .regex(
              /^\+?[0-9]{7,15}$/,
              "phone must be a valid number (7–15 digits, optional leading +)",
            ),
        ])
        .optional(),

      address: z
        .string({ message: "address must be a string" })
        .max(300, "address must be 300 characters or fewer")
        .optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field (name, phone, or address) must be provided.",
    }),
});

export type UpdateProfileBody = z.infer<typeof updateProfileSchema>["body"];
