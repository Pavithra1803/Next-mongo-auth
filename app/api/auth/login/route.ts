import { NextResponse } from "next/server";
import {connectDB} from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import User from "@/models/User";
import Otp from "@/models/Otp";

import jwt from "jsonwebtoken";
import {cookies} from "next/headers";



export async function POST(req:Request){
    try{
        const {email,password}= await req.json();

        if(!email || !password){
            return NextResponse.json(
                {message:"All fields are required"},
                {status:400}
            )
        }

        await connectDB();

        const user = await User.findOne({
            email:email.toLowerCase(),
        }).select("+password");

        if(!user){
            return NextResponse.json(
                {message:"Not a valid user"},
                {status :401}
            )
        }

        if(!user.isVerified) {
            return NextResponse.json(
                {message:"Please verify your account first"},
                {status :403}
            )
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return NextResponse.json(
                {message:"Invalid email or password"},
                {status :401}
            )
        }

        const otp = crypto.randomInt(100000,1000000);
       
        await Otp.deleteMany({userId: user._id});

        await Otp.create({
            userId: user._id,
            otp:otp.toString(),
            expiresAt:new Date(Date.now()+5*60*1000),
        }) 

        return NextResponse.json(
                {message:"OTP sent for verification",
                otp,
                },
                
            )
    }catch(error){
        console.log("Login step-1 error ",error );
        return NextResponse.json(
                {message:"Internal server error"},
                {status :500}
            )
    }
}