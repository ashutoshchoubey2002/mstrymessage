import { z } from 'zod'

export const usernameValidation = z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(20, 'Username must be no more than 20 ')
    .regex(/^[a-zA-Z0-9_]+$/,
        'Username must not contain special character ')

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: "Invalid E-mail Address" }),
    password: z.string().min(6, { message: 'password must be at leasst 6 characters' })
})



