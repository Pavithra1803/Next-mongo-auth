"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function VerifyOtpPage(){

    const router= useRouter();

    const email=sessionStorage.getItem("otpEmail") || "";
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [timer,setTimer] = useState(60);
    const [message,setMessage]=useState("");

    useEffect(()=>{
        if(timer === 0) return;
        const interval = setInterval(()=>{
            setTimer((t)=>t-1);
        },1000);
        return ()=> clearInterval(interval);
    },[timer]);

    async function handleVerify(e:React.FormEvent){
        e.preventDefault();
        setError("");
        setLoading(true);

            const res = await fetch("/api/auth/verifyOtp",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({email,otp})
            })

            const data=await res.json();
            setLoading(false);

            if(res.ok){
                sessionStorage.removeItem("otpEmail");
                router.push("/login");
            }
            
            setMessage(data.message);
                    

    }

    async function handleResendOtp(e:React.FormEvent){
        setLoading(true);
        setMessage("");
        setOtp("");

        const res = await fetch("/api/auth/resendOtp",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({email})
        });

        const data=await res.json();
        setLoading(false);
        setTimer(60);
        setMessage(data.message);

    }
    return(
        <div>
            <h1>Verify OTP</h1>
            {message && <p style={{color:"red"}}>{message}</p>}

            <form>

            <input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e)=>setOtp(e.target.value)}>
            </input>
            <br/>

            <button onClick={handleVerify} disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
            </button>

             <button onClick={handleResendOtp} disabled={timer>0 || loading}>
                {timer>0 ? `Resend OTP in ${timer}s...` : "Resend OTP"}
            </button>

            </form>

        </div>
    )

}