import prismaClient from "@/app/lib/db/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod"
const upVoteSchema = z.object({
    streamId: z.string(),
})


export async function POST(req: NextRequest) {
    const session = await getServerSession() // get the users deatils on the backend that is logged in
    //TODO // we can get rid of db call here if we get the id fromm the session (callback in authoptions)
    const user = await prismaClient.user.findFirst({
        where: {
            email: session?.user?.email ?? ""
        }
    })
    if (!user) { // by default next auth gives u email not the id we need to do callback
        return NextResponse.json({
            message: "unauthanticated"
        }, {
            status: 403
        })
    }

    try {
        const data = upVoteSchema.parse(await req.json())
        await prismaClient.upvotes.create({
            data:{
                userId:user.id,
                streamId:data.streamId // the streamid will be itself populated from stream table 
            }
        });

        return NextResponse.json({
            message:"done"
        })
    } catch (error) {
       return NextResponse.json({
        message:"trying to upvote twice"
       },{
        status:403
       }) 
    }

}