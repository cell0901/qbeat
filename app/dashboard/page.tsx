import { getServerSession } from "next-auth";
import StreamView from "../components/StreamView";
import { getUserId } from "../lib/actions/getUserId";
import { authOptions } from "../lib/authOptions";
import { redirect, useRouter } from "next/navigation";


// const creatorId ="7c8e6f5f-25e5-4796-b377-5225c0ec3cd4"
export default async function Dashboard(){
  const session = await getServerSession(authOptions) 
  const user =  session?.user?.email 
  if(!user){
  redirect('/')
  }
  const creatorId = await getUserId(user) 
    return  <StreamView creatorId={creatorId} playVideo={true}/>
}