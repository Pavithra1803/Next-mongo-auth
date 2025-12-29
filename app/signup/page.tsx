"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import { signIn } from "next-auth/react";


export default function SignupPage(){
    const router= useRouter();

    const [form,setForm] = useState({
        name:"",
        email:"",
        password:"",
        cnfpassword:"",
    });

    const [loading,setLoading]=useState(false);
    const [error,setError]=useState("");

    async function handleSubmit(e: React.FormEvent){
        e.preventDefault();
        setError("");
        setLoading(true);

        try{
            const captchaToken ="dummy-token";
            
            const res = await fetch("/api/auth/register",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({
                    ...form,
                    captchaToken,
                })
            })

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message);
            }
            sessionStorage.setItem("otpEmail",form.email);
            router.push(`/verify-otp`);
        }catch(err: any){
            setError(err.message ||"Signup failed")
        }finally{
            setLoading(false);
        }
    }
    return (
        <div>
            <h1>Signup</h1>
            {error && <p style={{color:"red"}}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Name"
                    value={form.name}
                    onChange={(e)=>setForm({...form,name:e.target.value})}>
                </input>
                <br/>
                 <input
                    placeholder="Email"
                    value={form.email}
                    onChange={(e)=>setForm({...form,email:e.target.value})}>
                </input>
                <br/>
                 <input
                    placeholder="Password"
                    type="password"
                    value={form.password}
                    onChange={(e)=>setForm({...form,password:e.target.value})}>
                </input>
                <br/>
                 <input
                    type="password"
                    placeholder="Confirm Password"
                    value={form.cnfpassword}
                    onChange={(e)=>setForm({...form,cnfpassword:e.target.value})}>
                </input>

                <br/>

                <button disabled={loading}>
                    {loading?"Signing up..." : "Signup"}
                </button>
                <br></br>
                <h1>OR</h1>
                <br></br>
                <button onClick={()=>signIn("google")}>
                    Continue with Google
                </button>
                <br></br>
                <button onClick={()=>signIn("github")}>
                    Continue with Github
                </button>

            </form>
        </div>
    );
}