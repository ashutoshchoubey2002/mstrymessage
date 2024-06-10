import dbConnect from "@/app/lib/dbConnect";
import Usermodel from "@/app/Model/User";
import bcrypt from "bcrypt"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();

    try {   
        const { username, email, password } = await request.json()

        // user jiska username bhi hai or verified bhi hai (suddha user or request kr rha h)
        const existingUserVerifiedUserByUsername = await Usermodel.findOne({

            username,
            isVerified: true

        })

        
        if (existingUserVerifiedUserByUsername) {

            return Response.json({
                success: false,
                message: "Username is already taken"
            }, { status: 400 })
        }


        // same thing email se 

        const existingUserByemail = await Usermodel.findOne({ email })

        const verifyCode = Math.floor(10000 + Math.random() * 90000).toString()

        if (existingUserByemail) {

            if (existingUserByemail.isVerified) {
                return Response.json({
                    success: false,
                    message: 'User already exist with this E-mail'
                }, { status: 400 })
            }else{

                const hasedPassword = await bcrypt.hash(password, 10)
                existingUserByemail.password  = hasedPassword
                existingUserByemail.verifyCode = verifyCode
                existingUserByemail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByemail.save()


            }

             // todo back here 

        } else {
            const hasedPassword = await bcrypt.hash(password, 10)

            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new Usermodel({
                username,
                email,
                password: hasedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })

            await newUser.save()
        }

        // sand verification email

        const emailResponce = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if (!emailResponce.success) {
            return Response.json({
                success: false,
                message: emailResponce.message
            }, { status: 500 })
        }


    } catch (error) {
        console.log("Error registering user", error);
        return Response.json(
            {
                success: false,
                message: "Error registering user"
            },
            {
                status: 500
            }
        )
    }
}

