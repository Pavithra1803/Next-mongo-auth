import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

export function middleware(request: NextRequest) {
  try{
    const token = request.cookies.get("token")?.value;
    const isApi = request.nextUrl.pathname.startsWith("/api");

    if(!token){
      return isApi
       ? NextResponse.json({message:"Authentication required"},{status:401})
       : NextResponse.redirect(new URL("/login", request.url))

    }


    return NextResponse.next(); //next() - go to the next handler
  }catch(error){
    const isApi = request.nextUrl.pathname.startsWith("/api");

    return isApi
      ? NextResponse.json({ message: "Invalid or expired token" }, { status: 401 })
      : NextResponse.redirect(new URL("/login", request.url));
 
  }

}

export const config = {
  matcher: [
    "/api/protected/:path*", // protected APIs
    "/dashboard/:path*",     // protected pages
  ],
};