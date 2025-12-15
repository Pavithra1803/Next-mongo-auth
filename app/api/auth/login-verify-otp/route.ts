import { NextResponse } from "next/server";
import {connectDB} from "@/lib/db";
import {signToken} from "@/lib/jwt";

import User from "@/models/User";
import Otp from "@/models/Otp";


import {cookies} from "next/headers";

export async function POST(req:Request){
    try{
        const {email,otp}=await req.json();

        if (!email || !otp) {
            return NextResponse.json(
                { message: "Email and OTP are required" },
                { status: 400 }
            );
        }

        await connectDB();

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        const otpRecord = await Otp.findOne({
            userId: user._id,
            otp,
        });

        if (!otpRecord) {
            return NextResponse.json(
                { message: "Invalid OTP" },
                { status: 400 }
            );
        }

        if(otpRecord.expiresAt < new Date()){
            return NextResponse.json(
                { message: "OTP Expired" },
                { status: 400 }
            );
        }

        const token = signToken({
            userId: user._id,
            email: user.email,
        });

        const cookie = await cookies();
        cookie.set("token",token,{
            httpOnly:true, //js cant read this cookie
            secure: process.env.NODE_ENV === "production", //https only 
            sameSite: "strict", //Cookie sent only for same-site requests
            maxAge: 60*60*24,
            path: "/",
        });

        await Otp.deleteMany({ userId: user._id });

        return NextResponse.json({
        message: "Login successful",
        });

    }catch(error){
        console.error("Login OTP verify error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}