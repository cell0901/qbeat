"use client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function Redirect(){
// this will redirect the user to that dashboard if ig logged in
 const session = useSession()
 const router = useRouter()
 useEffect(()=>{
 if (session?.data?.user){ // if logged in user pushed to /dashboard
    router.push('/dashboard')
 }
 },[session])
 return null 
}