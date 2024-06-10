import { resend } from "@/app/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";


export async function sendVerificationEmail(

    email: string,
    username: string,
    verifyCode: string

): Promise<ApiResponse> {

    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Message verification code ',
            react: VerificationEmail({ username , otp:verifyCode}),
          });

        return {success: true, message: 'verification mail send suessfully'}
        
    } catch (emailError) {
        console.log("Error sending verification email", emailError);
        return {success: false, message: 'failed to send verification email'}
    }
}


