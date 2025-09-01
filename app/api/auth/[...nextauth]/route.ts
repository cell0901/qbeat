import { authOptions } from "@/app/lib/authOptions";
import NextAuth from "next-auth";

const handler = NextAuth (authOptions) // gonna use login with google 


export {handler as GET, handler as POST}
// export const handler = GET()  // all post and get on this route will be handled by handlers
// export const handler = POST()