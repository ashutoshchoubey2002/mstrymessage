import{z} from 'zod'


export const acceptMessgeSchema = z.object({
    acceptMessages: z.boolean(),
}) 