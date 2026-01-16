export const dynamic = "force-dynamic";

import { NextResponse} from "next/server";
import {connectDB} from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";

export async function POST(req:Request) {
    try {
        const {email,otp} = await req.json();

        if(!email || !otp) {
            return NextResponse.json(
                {message : "Please enter the otp"},
                {status:400}
            );
        }

        await connectDB();

        const user = await User.findOne({
            email:email.toLowerCase(),
        });

        if(!user){
            return NextResponse.json(
                {message:"User not found"},
                {status :400}
            )
        }

        if(user.isVerified){
            return NextResponse.json(
                {message:"User already verified"},
                {status :400}
            )
        }

        const otpRecord = await Otp.findOne({
            userId:user._id,
            otp,
        })

        if(!otpRecord){
            return NextResponse.json(
                {message:"Invalid Otp"},
                {status :400}
            )
        }

        if(otpRecord.expiresAt < new Date()){
            return NextResponse.json(
                {message:"Otp expired"},
                {status :400}
            )
        }

        user.isVerified = true;
        await user.save();

        await Otp.deleteMany({userId:user._id});

        return NextResponse.json(
            {message : "OTP verifed successfully"}
        );

    }catch(error){
        console.log("Verify OTP error : ",error);
        return NextResponse.json(
            {message:"Internal server error"},
            {status:500}
        )
    }
}