import { Message } from "@/app/Model/User";


export interface ApiResponse{ 

     success : boolean ; 
     message:string ; 
     isAccceptingMessages?: boolean ; 
     messages?:Array<Message>


}