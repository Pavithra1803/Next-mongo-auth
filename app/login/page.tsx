"use client"

import { useState } from "react";
import {useRouter} from "next/navigation";

export default function LoginPage(){
    const router = useRouter();

    const [form,setForm]=useState({
        email:"",
        password:""
    })

    const [loading,setLoading] = useState(false);
    const [error,setError] = useState("");

    async function handleSubmit(e: React.FormEvent)
     {
        e.preventDefault();
        setError("");
        setLoading(true);

        try{
            const res=await fetch("/api/auth/login",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({
                    ...form
                })
            })

            const data=await res.json();
            
            if(!res.ok){
                throw new Error(data.message)
            }

            router.push(`/`)

        }catch(error:any){
            setError(error.message || "Login failed")
        }finally{
            setLoading(false);
        }
    }
    return(
        <div>
            <h1>Login</h1>
            {error && <p style={{color:"red"}}>{error}</p>}

            <form onSubmit={handleSubmit}>
                
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

                <button disabled={loading}>
                    {loading?"Logging up..." : "Login"}
                </button>

            </form>
        </div>
    )
}
