import { z } from "zod";

const User = z
  .object({
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
  })
  
  



export default function loginUserValidation(req, res, next) {
  const { email, password } = req.body;

  const result = User.safeParse({
    email,
    password,
  });

  if (!result.success) {
    result.error.issues.forEach((err) => {
      return next(err);
    });
  }
  return next();
}
