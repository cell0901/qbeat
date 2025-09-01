import StreamView from "@/app/components/StreamView"

interface PageProps {
  params: Promise<{ creatorId: string }>;
}
export default async function Creator({params}: PageProps){ // in next 15 router are async and returns promise so we use this
 
    const { creatorId }= await params

 // gettin the creator id from the params
    return <div>
    <StreamView creatorId={creatorId} playVideo={false}/>
    </div>

}
