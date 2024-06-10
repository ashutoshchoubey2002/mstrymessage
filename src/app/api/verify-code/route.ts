import dbConnect from "@/app/lib/dbConnect";
import Usermodel from "@/app/Model/User";


export async function POST(request:Request) {

    await dbConnect()
    try {
       const {username, code} =  await request.json()

       const deCodedUsername = decodeURIComponent(username)

       const user = await Usermodel.findOne({username:deCodedUsername})

       if(!user)
        {
           
        return Response.json(
            {
                sussess: false,
                message: "user Not Found"

            }, { status: 500 }
        )
        }

        const isCodeValid = user.verifyCode === code 
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save()

            return Response.json(
                {
                    sussess: true,
                    message: "Account Verified Successfully"
    
                }, { status: 200 }
            )
        }
        else if (!isCodeNotExpired) {
            return Response.json(
                {
                    sussess: false,
                    message: "Verification Code has Expired plz sign-in again to get a new CODE"
    
                }, { status: 400 }
            )
        }



    } catch (error) {

        console.error('Error checking username', error);
        return Response.json(
            {
                sussess: false,
                message: "Error checking username"

            }, { status: 500 }
        )
        
    }

    
}