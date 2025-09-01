import GoogleProvider from "next-auth/providers/google";
import prismaClient from "./db/db";
import { User } from "next-auth";
export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "", // incase the env var doenst exits means undefined buty clietnId is string thats why
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
  })
    ],
    secret:process.env.NEXTAUTH_SECRET || "something", // secret required for decoding jwts
    callbacks:{
        async signIn(params: {user: User}){ // wheenever singin happens
            if (!params.user.email){
                return false // return false and callback wont run
            }
            try {
             await prismaClient.user.create({
                data:{
                    email:params.user.email, 
                    provider:"Google"
                }
            })   
            } catch (error) {

            }
            
            return true //return true if user data updated in db
        }
    }
}