import * as z from "zod";

export const serverSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "server name is required")
    .max(100, "Server name can't be more then 100 chars"),
  icon: z.url().optional(),
});

export const editServerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "server name is required")
      .max(100, "Server name can't be more then 100 chars")
      .optional(),
    icon: z.url().optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided",
  );

export const transferOwnerSchema = z.object({
  memberId: z.uuid(),
  oldOwnerRole: z.enum(["ADMIN", "MODERATOR", "MEMBER"]),
});

export type createServerSchema = z.infer<typeof serverSchema>;
export type editServerSchema = z.infer<typeof editServerSchema>;
export type transferOwnerSchema = z.infer<typeof transferOwnerSchema>;
