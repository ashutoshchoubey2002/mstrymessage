import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth].js/options";
import Usermodel from "@/app/Model/User";
import dbConnect from "@/app/lib/dbConnect";
import { User } from "next-auth";


export async function POST(request: Request) {
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

    const userId = user._id;
    const { acceptMessages } = await request.json()

    try {

        const updatedUser = await Usermodel.findByIdAndUpdate(userId
            , { isAcceptingMessage: acceptMessages }
            , { new: true })

        if (!updatedUser) {
            return Response.json(
                {
                    sussess: true,
                    message: "Message acceptence  status updated successfully   ",
                    updatedUser

                }, { status: 200 }
            )
        }

    } catch (error) {

        console.log("Failed to Update user status to accept messages");

        return Response.json(
            {
                sussess: false,
                message: "Failed to Update user status to accept messages"

            }, { status: 500 }
        )

    }

}

export async function GET(request: Request) {

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

    const userId = user._id;

    try {
        const foundUser = await Usermodel.findById(userId)

        if (!foundUser) {
            return Response.json(
                {
                    sussess: true,
                    message: "User not found ",


                }, { status: 404 }
            )
        }

        return Response.json(
            {
                sussess: true,
                isAccceptingMessage: foundUser.isAcceptingMessage,


            }, { status: 200 }
        )

    } catch (error) {

        console.log("Failed to Update user status to accept messages");

        return Response.json(
            {
                sussess: false,
                message: "Error is getting message acceptance ststus "

            }, { status: 500 }
        )

    }

}



