export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import {connectDB} from '../../../lib/db';

export async function GET(){
    await connectDB();
    return NextResponse.json({message: 'hello from app router apiiiii'})
}