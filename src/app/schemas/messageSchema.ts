import{z} from 'zod'


export const messageSchema = z.object({
    content: z.string()
    .min(10,{message:'message must be at leat 10 characters'})
    .max(300 , {message:'Content must be no longer than 300 characters '})
}) 