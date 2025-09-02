"use client"
import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"

export const Appbar = () => {
    const session = useSession() // get the session of the logged in user
    return <div className="bg-zinc-900/70 backdrop-blur-sm border-b border-zinc-800 rounded-lg pb-2  sticky top-0 z-50">
        <div className="w-full px-6 py-2">
            <div className="flex justify-between items-center">
                <div className="text-xl font-bold text-white">
                   Qbeat 
                </div>
                <div>
                    {session?.data?.user && <Button 
                  size="lg"
                  variant="outline"
                  className="bg-green-500 hover:bg-green-600 text-black font-bold border-green-500 px-6 py-2"
                        onClick={()=>{signOut()}}
                >
                 Logout 
                </Button>}  {/**is user logged in show logout buttong */}
                    {!session?.data?.user && <Button 
                  size="lg"
                  variant="outline"
                  className="bg-green-500 hover:bg-green-600 text-black font-bold border-green-500 px-6 py-2"
                        onClick={()=>{signIn()}}
                >
                Signin 
                </Button> }
                </div>
            </div>
        </div>
    </div>
}