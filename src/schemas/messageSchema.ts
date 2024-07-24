import {z} from "zod";

export const MessageSchema = z.object({
    content: z
    .string()
    .min(10, {message: 'Content must contain a minimum of 10 characters'})
    .max(300, {message: 'Content should not contai  more than 300 characters'})
})