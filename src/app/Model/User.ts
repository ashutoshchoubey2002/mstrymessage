import mongoose, { Schema, Document } from "mongoose";


//  message Schema and typescript interface

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({

    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }

})    

// User Schema for authentication 

export interface User extends Document {
    username:string ;
    email: string;
    password: string;
    verifyCode:string ; 
    verifyCodeExpiry:Date ; 
    isVerified: boolean ;  
    isAcceptingMessage:boolean ; 
    messages: Message []
}

const emailPattern = /.+\@+\..+/ ;
const UserSchema: Schema<User> = new Schema({

    username: {
        type: String,   
        required: [true , "Username is required"],
        trim: true , 
        unique:true
    },
    email: {
        type: String,
        required: [true , "email is required"],
        match:[emailPattern,'please use a valid e-mail addresss']
    },
    password:{
        type:String ,
        required:[true," Password is  required"],

    } ,
    verifyCode:{
        type:String,
        required:[true,"Verify code is required"]
    } ,
    verifyCodeExpiry:{
        type:Date,
        required:[true,"Verrify Expiry code is required "]
    },
    isVerified:{
        type:Boolean,
        default: false
    },
    isAcceptingMessage:{
        type:Boolean,
        default: true
    },
    messages:[MessageSchema]


})    

const Usermodel = (mongoose.models.User as mongoose.Model<User>) ||  mongoose.model<User>("User",UserSchema)

export default Usermodel ; 