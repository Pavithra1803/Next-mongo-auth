export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import {cookies} from "next/headers";
import { verifyToken } from "@/lib/jwt";

export async function GET(){
    const token = (await cookies()).get("token")?.value;

    if(!token){
        return NextResponse.json(
            {message:"Unauthorized"},
            {status:401}
        );
    }

    try{
        const payload = verifyToken(token);

        return NextResponse.json({
            message: "Access granted",
            user: payload,
        });


    }catch(error){
        return NextResponse.json(
            { message: "Invalid or expired token" },
            { status: 401 }
        );
    }
}

