"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function OAuthCallbackPage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") return;

    const completeLogin = async () => {
      await fetch("/api/auth/oauth-success", {  
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user?.email,
        }),
      });

      window.location.href = "/";
    };

    completeLogin();
  }, [status, session]);

  if (status === "loading") {
    return <p>Signing you in...</p>;
  }

  return <p>Completing login...</p>;
}
