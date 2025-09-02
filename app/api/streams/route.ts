import { NextRequest, NextResponse } from "next/server";
import { z } from "zod"
import prismaClient from "@/app/lib/db/db"
// using some old api to get thumbnal and title (not sure if its official or not)
// import { GetVideoDetails } from "youtube-search-api";
import { YT_REGEX } from "@/app/lib/utils";
import { getServerSession } from "next-auth";
// got this regex from npm is youtube url code
const createStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string() // the url we parse to check if it is spotify or youtube
})
const MAX_QUEUE_LEN =  50 
    import { Prisma } from '@prisma/client'

// Then define your type like this:
type StreamWithCountAndUpvotes = Prisma.StreamGetPayload<{
  include: {
    _count: {
      select: {
        upvotes: true
      }
    },
    upvotes: true
  }
}>
export async function POST(req: NextRequest) {
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
    
    try { // throw error and not cut the process if user sends error data/ wrong data
        const data = createStreamSchema.parse(await req.json())// get the json data
        const isYt = data.url.match(YT_REGEX)
        if (!isYt) {
            return NextResponse.json({
                message: "wrong url format"
            })
        }
        const extractedId = isYt[1] // this will split into array of 2 elements with  get the id of youtube video url

        //         if (!youtubesearchapi || typeof youtubesearchapi.GetVideoDetails !== 'function') {
        //     console.error('YouTube search API is not properly loaded');
        //     return NextResponse.json({
        //         message: "YouTube API service unavailable"
        //     }, { status: 500 })
        // }

            
        const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${extractedId}&format=json`;
        const res = await fetch(oembedUrl)
        const youtubeData = await res.json()
        // const youtubeData = await GetVideoDetails(extractedId) // get the youtube video data like title and thumnail from id
        
        console.log('after u tube data')
        // const thumbnails = youtubeData.thumbnail.thumbnails
        // thumbnails.sort((a: { width: number }, b: { width: number }) => a.width < b.width ? -1 : 1) // this will update the orginal arr
        // Negative value (-1): first element comes before second
        // Positive value (1): first element comes after second
        const exsitingAddedStreams = await prismaClient.stream.count({
            where:{
                userId: data.creatorId  // adding stream
            }
        })
        // or we can add rate limiting for per user like only 2 streams per 5 min or something
        if (exsitingAddedStreams > MAX_QUEUE_LEN) { // means for this creator max 50 songs/streams can be added

            return NextResponse.json({
                message:"Limit for adding streams already reached"
            },{
                status:411
            })
    }
        const stream = await prismaClient.stream.create({
            data: {
                userId: data.creatorId,
                addedById: user.id, // the id of the user who added this stream
                url: data.url,
                extractedId,
                type: "Youtube",
                title: youtubeData.title ?? "Cant find video",
                smallImg: "https://media1.tenor.com/m/t3dLLNaI50oAAAAC/cat-cats.gif",
                // if youtube give more than
                // one thumbnail then get second last img or else use the only one big img (same for big and small)
                bigImg: youtubeData.thumbnail_url ?? "https://media1.tenor.com/m/t3dLLNaI50oAAAAC/cat-cats.gif"

            }
        })
        return NextResponse.json({
        ...stream, // return this data after addinng a stream, means sends the id etc
        hasUpvoted:false,
        upvotes:0
        })
    } catch (err) {
        console.log(err)
        return NextResponse.json({ message: "error while adding a stream" },
            {
                status: 411
            })
    }
    // user send the creator id that they want their stream to add 
}

// let anyonee get the current streams with upvotes
export async function GET(req: NextRequest) {
    // so every user needs to signup
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
    // get the url query params
    const creatorId = req.nextUrl.searchParams.get("creatorId") // get the creator ID and get all the streams associated to this creator id
   
    if (!creatorId) {
    return NextResponse.json({
        message:"Error"
    },{
        status:411  
    })
   }

   try {
     const [streams, currentStream] = await Promise.all([await prismaClient.stream.findMany({ // getting all the streams from the creatorId(WHICH IS USER ID)
        where: {
            userId: creatorId,  // get the streams based on the creatorId
            played:false
        },
        include:{
            _count:{
                select:{
                    upvotes: true // get the count of upvotes of a specific stream form upvotes[] table
                }
            },
            upvotes:{
                where:{
                    userId: user.id // this will get upvotes of user of the user logged in . getserversession 
                }
            }
        }
        
    }), prismaClient.currentStream.findFirst({
        where:{
            userId:creatorId // get the currentl streams
        },
        include:{
            stream: true // to get the stream table relation to true
        }
    })])
    return NextResponse.json({
        // destrucuring 
        // _count = { upvotes: 4  }
// rest = { id: "123", title: "My Stream", url: "http://...", userId: "user1", type: "LIVE", ... } (everything except _count)
       streams: streams.map(({_count, ...rest}:StreamWithCountAndUpvotes)=>({
        ...rest,
        upvotes: _count.upvotes,
        haveUpvoted: rest.upvotes.length ? true : false // if upvotes then true else false if user have upvotes the lenght will not be 0 and user
        // can only upvote once
       })) ,
       currentStream 
    })

   
   } catch (error) {
        console.log(error)   
        return NextResponse.json({
            message:"erro while getting streams"
        })
   } 
}


