"use client"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, ThumbsDown, Play, Plus, Music, Users, Clock, Share, Share2, PlayIcon, PackageOpen, User } from "lucide-react"
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import { YT_REGEX } from "../lib/utils"
import { Appbar } from "./AppBar"
import YouTubePlayer from 'youtube-player';
interface Stream {
  id: string
  type: string
  title: string
  extractedId: string
  active: boolean 
  userId: string
  url: string
  smallImg: string
  bigImg: string
  upvotes: number
  haveUpvoted: boolean
}

const REFERSH_MS = 10 * 1000 // every ten secs refresh
export default function StreamView({
    creatorId,
    playVideo = false
}:{
    creatorId: string
   playVideo: boolean 
}) {

  const [newStreamUrl, setNewStreamUrl] = useState("")
  const [playNextLoader,setPlayNextLoader] = useState(false)
  const [currentlyPlaying, setCurrentlyPlaying] = useState<Stream | null>(null)
  const [loading, setLoading] = useState(false)
  const [queue, setQueue] = useState<Stream[]>([])
  const [showToast, setShowToast] = useState(false)
 const videoPlayerRef = useRef<HTMLDivElement>(null)

  async function refreshStreams() {
    const res = await fetch(`/api/streams/?creatorId=${creatorId}`, {
        credentials: "include"
    });
    const json = await res.json();
    setQueue(json.streams.sort((a: Stream, b: Stream) => a.upvotes < b.upvotes ? 1 : -1));
    
    setCurrentlyPlaying(video => {
        if (video?.id === json.currentStream?.stream?.id) { // gets the current stream running
            //It checks if the current video's ID matches the ID of json.currentStream.stream
          // If they match: Return the existing video (no change)
            return video; // returns the current video state doesnt change
        }
        return json.currentStream.stream //If they don't match: Return json.currentStream.stream (update the state)
    });
  }
 
// long polling streams every 10 secs
 useEffect(()=>{
   refreshStreams()
    const interval = setInterval(()=>{ // this will 
    refreshStreams()
    }, REFERSH_MS)

    return () => clearInterval(interval) 
    // this is cleanup function means unmounts the interval when the component get remove and user moves to another page. so prevents memeory leaks
 },[])

useEffect(()=>{
  if(!videoPlayerRef.current){ // is null
    return;
  }

  // player is set to VideoPlayerRef null
const player = YouTubePlayer(videoPlayerRef.current); // The string 'video-player' is the element ID - it's the id attribute of an HTML element where you want the YouTube player to be embedded.
// 'loadVideoById' is queued until the player is ready to receive API calls.
player.loadVideoById(currentlyPlaying?.extractedId || ""); 

// 'playVideo' is queue until the player is ready to received API calls and after 'loadVideoById' has been called.
player.playVideo();

function eventHandler(event: CustomEvent & {data:number}) {
        console.log(event);
        console.log(event.data);
        if (event.data === 0) {
            playNext(); 
        }
    };
// player.on event emitter is used to listen to all YouTube IFrame Player API events
player.on('stateChange', eventHandler);
return () =>{ // the cleanup function from the previous effect run is eecuted before the new effect runs. so the player is destroyed nd 
  // new one is created
  player.destroy()
}
},[currentlyPlaying, videoPlayerRef])

  const handleVote = (streamId: string, isUpvote:boolean) => {
      // Remove the vote if clicking the same button
     setQueue(queue.map(video=>

      video.id === streamId ? {
        ...video,
        upvotes: isUpvote ? video.upvotes + 1 : video.upvotes -1 , // if have upvoted upvotes will be +1 else video.upvotes will -1 
        haveUpvoted: !video.haveUpvoted 
      } 
      :
      video
     ).sort((a,b)=>(b.upvotes)- (a.upvotes))) // sort the queue based on upvotes

   fetch(`/api/streams/${isUpvote ? 'downvote': 'upvote'}`,{ // send if haveUpvoted is true send it to /upvote. which will do nothing as 
    // as we defined in db
    // but if haveUpvoted is false then / downvote which will delete the entry in db
    method:"POST",
    body:JSON.stringify({
      streamId
    })
   }) 
  }

  const handleAddStream =async () => {
   // add new stream to queue after clicking add  
   setLoading(true)
 const res = await fetch('/api/streams',{
  method: "POST",
  body: JSON.stringify({
    creatorId, //  
    url: newStreamUrl
  })
 })
     // do post fetch request here to streams table
    setQueue( [...queue, await res.json()]) // we set the queue of streams + this res newly added response
    setLoading(false)
    // or we can remove also since we doing call every 10 secs
  }
const shareStream = async ()=>{
  const shareLink = `${window.location.hostname}/creator/${creatorId}` // get the url or window
    try {
      await navigator.clipboard.writeText(shareLink)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } catch (err) {
      // Fallback for older browsers
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    }
}
const playNext = async () =>{
   if (queue.length > 0) {
 try {
     setPlayNextLoader(true)
        const data = await fetch('/api/streams/next',{ // get the most upvoted stream will be played
            method:"GET",
        })
        const json = await data.json()
        setCurrentlyPlaying(json.stream)
        setQueue(q => q.filter(x => x.id !== json.stream.id)) // sort while playing on next video, means sets the queue where
        // keep streams whose id does NOT equal json.stream.id(most upvoted stream) // basicaly 
 
 } catch (error) {

 }
 setPlayNextLoader(false)
}
}

  return (
    <div className="bg-black p-4">
        <Appbar/>
    <div className="min-h-screen bg-black">

       {showToast && (
           <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] animate-in slide-in-from-top-2 duration-300">
          <div className="bg-green-400 text-white px-4 py-2 rounded-lg shadow-lg border border-green-500">
            <span className="text-sm font-medium">Copied to clipboard</span>
          </div>
        </div>
      )}
      
      {/* Header */}
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                <Music className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">StreamQueue</h1>
                <p className="text-sm text-zinc-400">Community Music Dashboard</p>
              </div>
            </div>
             <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 text-zinc-300">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">1,247 listeners</span>
            </div>
             <Button 
                variant="outline" 
                size="sm"
                className="border-zinc-600 bg-green-500 "
              onClick={()=>{shareStream()}}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
          </div>
          
        </div>
        </div>

      <div className="w-full  px-3 py-5 space-y-6">
        {/* Main Content Grid - Left Side (Add Stream + Now Playing) and Queue (Right) */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Left Side - Add Stream and Currently Playing */}
          <div className="xl:col-span-2 space-y-6">
            {/* Add Stream Section */}
            <Card className="border-2 border-dashed border-zinc-700 bg-zinc-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Plus className="w-5 h-5 text-green-500" />
                  Add Stream to Queue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Paste YouTube URL here..."
                      value={newStreamUrl}
                      onChange={(e) => setNewStreamUrl(e.target.value)}
                      className="flex-1 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                            </div>
                <Button onClick={handleAddStream} disabled={loading} className="bg-green-500 hover:bg-green-600 text-black font-medium px-4">
                    {loading ? "Loading" : "Add to queue"}
                    </Button>

                  {newStreamUrl && newStreamUrl.match(YT_REGEX) && !loading && ( // show the embed when not loading match the regex and url exists 
                    <Card className="bg-gray-900 border-gray-900">
                      <CardContent className="p-2">
                        <LiteYouTubeEmbed alwaysLoadIframe={true} title="" id={newStreamUrl.split("?v=")[1] } />
                      </CardContent>
                    </Card>
                          )}
                </div>
              </CardContent>
            </Card>

            {/* Currently Playing */}
            {/** getting current video will be from database since the upvotes of the queue might keep changing */}
            <Card className="overflow-hidden bg-gradient-to-r from-zinc-900 to-zinc-800 border-zinc-700 h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Play className="w-5 h-5 text-green-500" />
                  Now Playing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                   {currentlyPlaying ?( // if currentplaying video exists then
                    <div>
                   { playVideo ? <>  
                   
                   <div ref={videoPlayerRef} className="w-full" />
                    </> :
                    <div> {/** show this if on creators page */}
                    <img
                    src={currentlyPlaying.bigImg|| "/placeholder.svg"}
                    alt={currentlyPlaying.title}
                    className="w-full h-60 object-cover rounded-lg"
                    />
                    <p className="text-center font-semibold text-white">{currentlyPlaying.title}</p> 
                    </div>
                    }
                </div>
                ):
                   (<p className="text-center py-8 text-white">No Video Playing</p>) 
                    } 
                    
                    {/* <Badge className="absolute top-2 right-2 bg-red-600 text-white">{currentlyPlaying.duration}</Badge> */}
                  </div>
                  <div className="space-y-3">
                    {/* <h3 className="text-xl font-bold text-white text-balance">{currentlyPlaying.title}</h3> */}
                    <div className="flex items-center gap-4 text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        Added by 
                        {/* {currentlyPlaying.addedBy} */}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex text-white items-center gap-2">
                      {playVideo &&  // only show the play next button if playVideo if true(which will be only true for creator on dashboard page)
                      // and not the /creator/creatorId page
                        <Button
                         disabled={playNextLoader} onClick={playNext} className="bg-purple-400 hover:bg-purple-500 
                         text-black font-medium px-4"><PlayIcon className="-mx-1"/> {playNextLoader ? "Loading..": "Play Next"}</Button> 
                         
                         }
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Queue - Right Side */}
          <div className="xl:col-span-3">
            <Card className="bg-zinc-900/80 backdrop-blur-sm border-zinc-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Clock className="w-5 h-5 text-green-500" />
                  Up Next ({queue.length} streams)
                {queue.length == 0 && <p className="text-white font-semibold "> (No Video In Queue)</p> } 
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {queue.map((stream, index) => {
                    return (
                      <div
                        key={stream.id}
                        className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800/80 transition-colors border border-zinc-700"
                      >
                        <div className="relative">
                          <img
                            src={`${stream.bigImg}`}
                            alt={stream.title}
                            className="w-full sm:w-40 h-24 object-cover rounded-md"
                          />
                          <Badge className="absolute top-1 right-1 text-xs bg-zinc-900/90 text-white">
                          {stream.type}
                          </Badge>
                          <Badge className="absolute bottom-1 left-1 text-xs bg-green-500 text-black">#{index + 1}</Badge>
                        </div>
                        <div className="flex-1 space-y-2">
                          <h4 className="font-semibold text-white text-balance line-clamp-2">{stream.title}</h4>
                          <div className="flex items-center gap-2">
                            {stream.haveUpvoted ? <Button  // intiazzlly it is false
                              variant="outline"
                              size="sm"
                              onClick={() => handleVote(stream.id, stream.haveUpvoted )} // if already upvoted send false else send true
                              className={`border-zinc-600 bg-red-200`}
                            >
                              <ThumbsDown className="w-3 h-3 mr-1" />
                              {stream.upvotes} 
                            </Button> :
                            
                             <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleVote(stream.id, stream.haveUpvoted)} // this will be false
                              className={`border-zinc-600 bg-green-200`}
                            >
                              <ThumbsUp className="w-3 h-3 mr-1" />
                              {stream.upvotes} 
                            </Button>
                            }
                           
                            <div className="ml-auto">
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
</div> 
</div>
  )
}