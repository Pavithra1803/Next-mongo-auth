"use client"

import { useState } from "react";
import {useRouter} from "next/navigation";
import {signIn} from "next-auth/react"

export default function LoginPage(){
    const router = useRouter();

    const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/dashboard");
    }
  };
    return(
        <div>
            <h1 style={{textAlign:"center", color:"blue"}}>Login</h1>
            {error && <p style={{color:"red"}}>{error}</p>}

            <form >
                
                 <input
                    placeholder="Email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}>
                </input>
                <br/>
                 <input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}>
                </input>
                
                <br/>

                <button type="button" onClick={handleLogin}>Login</button>

                {error && <p>{error}</p>}

                <h1>OR</h1>
                <br></br>
                <button type="button" onClick={()=>signIn("google")}>
                    Continue with Google
                </button>
                <br></br>
                <button type="button" onClick={()=>signIn("github")}>
                    Continue with Github
                </button>                

            </form>
        </div>
    )
}
