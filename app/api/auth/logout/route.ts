export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import {cookies} from "next/headers";

export async function POST(){
    try{
        const cookie = await cookies();
        cookie.set("token","",{
            httpOnly:true,
            secure: process.env.NODE_ENV === "production",
            sameSite:"strict",
            maxAge:0,
            path:"/",
        });

        return NextResponse.json({
            message: "Logged out successfully",
        });
    }catch(error) {
        console.log("Logout error : ",error);
        return NextResponse.json({
            message: "Logout failed",
        },
        {status:500}
    );
    }
}