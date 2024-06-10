import Usermodel from "@/app/Model/User";
import dbConnect from "@/app/lib/dbConnect"
import { Message } from "@/app/Model/User";


export async function POST(request:Request)
{
    await dbConnect()
    const {username, content} = await request.json()
    try {
        const user = await Usermodel.findOne({username})

        if (!user) {
            return Response.json(
                {
                    sussess: false,
                    message: "User not Found"
    
                }, { status: 401 }
            )
        }

        // is user accepting the messages 

        if (!user.isAcceptingMessage) {
            return Response.json(
                {
                    sussess: false,
                    message: "User is not accepting the messages "
    
                }, { status: 403 }
            )
        }

        const newMessage  = {content, createdAt: new Date()} 
        user.messages.push(newMessage as Message )
        await user.save()
        return Response.json(
            {
                sussess: true,
                messages: "message sent successfully"

            }, { status: 200 }
        )
    } catch (error) {
        console.log("Error adding messages ",error);
        
        return Response.json(
            {
                sussess: false,
                messages: "internal server error"

            }, { status: 500 }
        )
    }
}