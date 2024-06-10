import dbConnect from "@/app/lib/dbConnect";
import Usermodel from "@/app/Model/User";
import { usernameValidation } from '@/app/schemas/signUpSchema'
import { log } from "console";
import { z } from "zod";

const UsernameQuerySchema = z.object({
    username: usernameValidation,
});

export async function GET(request: Request) {

    // handle a case where - ensure whether the request is get or not ...
    // Not used in current version of next js 
    // if (request.method !== 'GET') {
    //     return Response.json(
    //         {
    //             success: false,
    //             message:'Only GET method is allowed',
    //         },
    //         { status: 405 }
    //     )
    // }
    
    await dbConnect()

    try {

        const { searchParams } = new URL(request.url);
        const queryParams = {
            username: searchParams.get('username'),
        };

        // validate with zod 
        const result = UsernameQuerySchema.safeParse(queryParams);

        console.log(result, 'Validation result ');

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json(
                {
                    success: false,
                    message:
                        usernameErrors?.length > 0
                            ? usernameErrors.join(', ')
                            : 'Invalid query parameters',
                },
                { status: 400 }
            );

        }

       const {username} = result.data 

       const existingVerifiedUser = await Usermodel.findOne({username , isVerified:true})

       if (existingVerifiedUser) {

        return Response.json(
            {
                success: false,
                message:'Username already taken',
            },
            { status: 400 }
        );
        
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


