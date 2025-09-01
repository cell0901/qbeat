import prismaClient from "@/app/lib/db/db"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

// route to change the current stream playing( hits by the creator)
export async function GET(){

 const session = await getServerSession() 
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

// find the most upvoted stream

const mostUpvotedStream = await prismaClient.stream.findFirst({
    where:{
        userId: user.id,
        played: false
    },
    orderBy:{
        upvotes: {
            _count: 'desc' // getting stream and ordering by upvotes count. descening (largest to smallest)
        }
    }
})

 //Promise.all() is a static method in JavaScript that takes an iterable (typically an array) of Promises as input and returns a single Promise.
 // if any single of promise failed to resolve this the main promise fails
await Promise.all([prismaClient.currentStream.upsert({ // update the current stream for playing it
    where:{
        userId: user.id
    },
    update:{
        streamId:mostUpvotedStream?.id 
    },
    create:{
        userId: user.id,
        streamId: mostUpvotedStream?.id
    }
}), prismaClient.stream.update({ // 
    where:{
        id: mostUpvotedStream?.id ?? ""
    },
    data:{
        played: true, // set true when users clicks play next button this sets to true and not longer show in the queue
        playedTs: new Date() // set the time stamp 
    }
    
})])

return NextResponse.json({
    stream: mostUpvotedStream
})
}