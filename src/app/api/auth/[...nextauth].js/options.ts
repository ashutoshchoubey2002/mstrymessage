import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt, { compare } from 'bcrypt'
import dbConnect from "@/app/lib/dbConnect";
import Usermodel from "@/app/Model/User";
import Email from "next-auth/providers/email";
import { any } from "zod";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect()
                try {

                    const user = await Usermodel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]

                    })
                    if (!user) {

                        throw new Error('No error found with this e-mail ')

                    }
                    if (!user.isVerified) {

                        throw new Error('Please verify your accoount first  ')
                    }
                    const isPasswordCorrct = await bcrypt.compare(credentials.password, user.password)
                    if (isPasswordCorrct) {
                        return user
                    } else {
                        throw new Error('Incorrect Password ')
                    }
                } catch (err: any) {
                    throw new Error(err)
                }

            }
        })

    ],
    callbacks: {
        async jwt({ token, user, }) {
            if (user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
                token.username = user.username
            }
            return token
        },
        async session({ session, token }) {
            session.user._id = token._id?.toString()
            session.user.isVerified = token.isVerified
            session.user.isAcceptingMessages = token.isAcceptingMessages
            session.user.username = token.username
            return session
        },
    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NextAuth_SECRET
} 