import {NextResponse} from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import {connectDB} from '@/lib/db'
import User from '@/models/User'
import Otp from '@/models/Otp'

export async function POST(req:Request){
    try{
        const {name,email,password,cnfpassword} = await req.json();

        if(!name || !email || !password || !cnfpassword){
            return NextResponse.json(
                {message:"All fields are required"},
                {status:400}
            )
        }
        if(password !== cnfpassword){
            return NextResponse.json(
                {message:"password and confirm password should match"},
                {status:400}
            )
        }

        await connectDB();

        const existingUser = await User.findOne({email:email.toLowerCase()});
        if(existingUser) {
            return NextResponse.json(
                {message : "User already exists"},
                {status:409}
            )
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user=await User.create({
            name,
            email:email.toLowerCase(),
            password: hashedPassword,
            isVerified : false,
        });

        const otp = crypto.randomInt(100000, 1000000);

        await Otp.create({
            userId: user._id,
            otp:otp.toString(),
            expiresAt: new Date(Date.now() + 5*60*1000)
        })

        return NextResponse.json({
            message:"User registered successfully. OTP sent.",
            otp,
        });
    }
    catch(error){
        console.log("Register error: ",error);
        return NextResponse.json(
            {message: "Internal server error"},
            {status:500}
        )
    }

}