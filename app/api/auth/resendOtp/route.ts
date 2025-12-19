import { NextResponse} from "next/server";
import crypto from "crypto";

import {connectDB} from "@/lib/db";
import { canSendOtp } from "@/lib/otpRules";
import { sendOtpEmail } from "@/lib/mail";

import User from "@/models/User";
import Otp from "@/models/Otp";

export async function POST(req:Request) {
    try {
        const {email} = await req.json();
        
        if (!email) {
            return NextResponse.json(
                { message: "Email is required" },
                { status: 400 }
            );
        }

        await connectDB();

        const user = await User.findOne({
            email:email.toLowerCase()
        })

        if(!user){
            return NextResponse.json(
                {message: "If the email exits, OTP will be sent"} //neutral response if user exists or do not exist  - to avoid emial probing 
            )
        }

        const check = await canSendOtp(user._id.toString(),);

        if(!check.allowed){
            return NextResponse.json(
                {message:check.message},
                {status: 429} //too many requests
            )
        }

        await Otp.deleteMany({
            userId: user._id
        });

        const otp = crypto.randomInt(100000,1000000).toString();

        await Otp.create({
            userId: user._id,
            otp,
            expiresAt :new Date(Date.now()+ 5*60*1000)
        })
        console.log("resent otp",otp);

        await sendOtpEmail(user.email,otp.toString());

        return NextResponse.json({
            message: "OTP resent successfully"
        });

    } catch(error){
        console.log("Verify OTP error : ",error);
        return NextResponse.json(
            {message:"Internal server error"},
            {status:500}
        )
    }
}