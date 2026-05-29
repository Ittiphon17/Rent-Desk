import { z } from "zod";

export const createTenantSchema = z.object({
  body: z.object({
    full_name: z.string({
      required_error: "Full name is required",
    }).min(2, "Full name must be at least 2 characters long"),
    email: z.string({
      required_error: "Email is required",
    }).email("Invalid email address"),
    phone: z.string().optional(),
    status: z.string().optional(),
  }),
});
