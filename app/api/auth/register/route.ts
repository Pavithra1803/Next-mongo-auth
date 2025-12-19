import {NextResponse} from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import {connectDB} from '@/lib/db';
import {sendOtpEmail} from "@/lib/mail";
import { isEmailDomainValid } from "@/lib/emailDomain";
import { canSendOtp } from "@/lib/otpRules";

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
        const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        //    /.../ is delimiters , ^ is start of string,[] is not,\s is whitespace,@ literal not spcl
        // [^\s@] this means any character except space
        // . is any character including the spcl character.
        // \. escape that and treat it as .
        //$ is end 

        if(!emailRegex.test(email)){
            return NextResponse.json(
                {message:"Invalid email format"},
                {status:400} //bad request
            )
        }

        const domainValid = await isEmailDomainValid(email);

        if(!domainValid){
            return NextResponse.json(
                {message:"Invalid domain"},
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
                {status:409} //conflict
            )
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user=await User.create({
            name,
            email:email.toLowerCase(),
            password: hashedPassword,
            isVerified : false,
        });

        const check = await canSendOtp(user._id.toString(),);

        if(!check.allowed){
            return NextResponse.json(
                {message:check.message},
                {status: 429} //too many requests
            )
        }

        const otp = crypto.randomInt(100000, 1000000);

        await Otp.create({
            userId: user._id,
            otp:otp.toString(),
            expiresAt: new Date(Date.now() + 5*60*1000)
        })
        console.log("Current otp: ",otp);
        
        await sendOtpEmail(user.email,otp.toString());

        return NextResponse.json({
            message:"User registered successfully. OTP sent."
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