import {z} from 'zod'

export const signInSchema = z.object({
    identifier: z.string().length(6,'Verification code must be 6 digit'),
    password:z.string(),
})