import { z } from "zod";

export const registrationSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Enter at least 2 characters")
      .max(80, "Enter no more than 80 characters"),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Enter a valid email address")
      .max(254, "Email is too long"),
    password: z
      .string()
      .min(8, "Use at least 8 characters")
      .max(128, "Use no more than 128 characters")
      .regex(/[A-Za-z]/, "Include at least one letter")
      .regex(/\d/, "Include at least one number"),
    confirmPassword: z.string().min(1, "Confirm your password"),
    terms: z.boolean().refine((accepted) => accepted, {
      message: "Accept the terms to continue",
    }),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegistrationFormValues = z.infer<typeof registrationSchema>;
