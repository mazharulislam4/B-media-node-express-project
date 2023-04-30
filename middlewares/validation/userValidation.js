import { z } from "zod";

const User = z
  .object({
    firstName: z
      .string()
      .min(1, { message: "First Name is required!" })
      .max(15)
      .trim(),
    lastName: z
      .string()
      .min(1, { message: "Last Name is required!" })
      .max(15)
      .trim(),
    email: z
      .string()
      .email({ message: "Invalid email address" })
      .min(1, { message: "Email is required!" })
      .trim(),
      password: z
      .string()
      .min(6, {
        message: "Password must be at least 6 characters and contain uppercase and lowercase letters, numbers, and special characters",
      })
      .regex(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/g, {
        message:
          "Password must be at least 6 characters and contain uppercase and lowercase letters, numbers, and special characters",
      }),

    confirmPassword: z
      .string()
      .min(6, {
        message: "Password must be at least 6 characters and contain uppercase and lowercase letters, numbers, and special characters",
      })
      .regex(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/g, {
        message:
          "Password must be at least 6 characters and contain uppercase and lowercase letters, numbers, and special characters",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirm"]
  });

export default function userValidation(req, res, next) {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  const result = User.safeParse({
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
  });

  if (!result.success) {
    result.error.issues.forEach((err) => {
      return next(err);
    });
  }
  return next();
}
