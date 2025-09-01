import prismaClient from "@/app/lib/db/db"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { includes } from "zod"

export async function GET(req: NextRequest) {
    // get the real queue of upcoming streams

    const session = await getServerSession() // get the users deatils on the backend that is logged in
    //TODO // we can get rid of db call here if we get the id fromm the session (callback in authoptions)
    const user = await prismaClient.user.findFirst({
        where: {
            email: session?.user?.email ?? "" // can get rid of db call we can get user id from the nextauth from callbacks
        }
    })
    if (!user) { // by default next auth gives u email not the id we need to do callback
        return NextResponse.json({
            message: "unauthanticated"
        }, {
            status: 403
        })
    }
    const streams = await prismaClient.stream.findMany({ // getting all the streams from the creatorId(WHICH IS USER ID)
        where: {
            userId: user.id
        },
        include:{
            _count:{
                select:{
                    upvotes: true // get the count of upvotes of a specific stream form upvotes[] table
                }
            },
            upvotes:{
                where:{
                    userId: user.id // user needs to know whether he have upvotes or not
                }
            }
        }
        
    })

    return NextResponse.json({

        // destrucuring 
        // _count = { upvotes: 4  }
// rest = { id: "123", title: "My Stream", url: "http://...", userId: "user1", type: "LIVE", ... } (everything except _count)
       streams: streams.map(({_count, ...rest})=>({
        ...rest,
        upvotes: _count.upvotes,
        haveUpvoted: rest.upvotes.length ? true : false // if upvotes then true else false if user have upvotes the lenght will not be 0 and user
        // can only upvote once
       })) 
    })
}