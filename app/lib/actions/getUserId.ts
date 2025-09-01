"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../authOptions"
import prismaClient from "../db/db"

export async function getUserId(email:string) {
    const user = await prismaClient.user.findFirst({
        where: {
            email: email 
        }
    })
    
    if (!user) {
        throw new Error("User not found in database")
    }
    
    return user.id
}