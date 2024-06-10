import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth].js/options";
import Usermodel from "@/app/Model/User";
import dbConnect from "@/app/lib/dbConnect";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request:Request)
{

    await dbConnect()

    const session = await getServerSession(authOptions)

    const user: User = session?.user as User

    if (!session || !session.user) {

        return Response.json(
            {
                sussess: false,
                message: "User not authenticated"

            }, { status: 401 }
        )
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const user = await Usermodel.aggregate([
            {$match:{id:userId}},
            {$unwind:'messages'},
            {$sort:{"messages.createdAt":-1}},
            {$group:{_id:'$_id',messages:{$push :'$messages'}}}
        ])

         if (!user || user.length) {
            return Response.json(
                {
                    sussess: false,
                    message: "User not Found"
    
                }, { status: 401 }
            )
         }

         return Response.json(
            {
                sussess: true,
                messages: user[0].messages

            }, { status: 200 }
        )

    } catch (error) {
        console.log("Unexpected error - get messages",error);
        
        return Response.json(
            {
                sussess: false,
                messages: "Unexpected error"

            }, { status: 500 }
        )
    }
}