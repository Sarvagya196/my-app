import {z} from 'zod';

export const usernameValidation = z
    .string()
    .min(2, "UserName must be atleast 2 characters")
    .max(20, "UserName should not exceed 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "UserName should not conatin special characters");

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid Email Address"}),
    password: z.string().min(6, {message: "password must be atleast 6 characters"})
});