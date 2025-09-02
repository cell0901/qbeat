import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    // get the real queue of upcoming streams

     return NextResponse.json({
        msg:"nothing is here"
    })
}