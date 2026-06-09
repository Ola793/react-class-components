import { z } from "zod";
import { validateEmail } from "../utils/validateEmail";

const MAX_IMAGE_SIZE = 1024 * 1024;

export const formSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .refine((value) => value[0] === value[0]?.toUpperCase(), {
        message: "Name must start with an uppercase letter",
      }),

    age: z.coerce
      .number({
        error: "Age is required",
      })
      .min(0, "Age cannot be negative"),

    email: z.string().min(1, "Email is required").refine(validateEmail, "Email is invalid"),

    gender: z.string().min(1, "Gender is required"),

    termsAccepted: z.boolean().refine((value) => value, {
      message: "You must accept Terms and Conditions",
    }),

    password: z.string().min(1, "Password is required"),

    confirmPassword: z.string().min(1, "Please confirm password"),

    country: z.string().min(1, "Country is required"),

    image: z
      .instanceof(File)
      .refine((file) => ["image/png", "image/jpeg"].includes(file.type), {
        message: "Image must be PNG or JPEG",
      })
      .refine((file) => file.size <= MAX_IMAGE_SIZE, {
        message: "Image must be less than 1 MB",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });

export type FormValues = z.infer<typeof formSchema>;
