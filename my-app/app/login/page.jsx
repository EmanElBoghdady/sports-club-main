"use client";
import Login from "@/src/components/Login";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    localStorage.setItem("loggedIn", "true");
    router.push("/dashboard");
  };

  return <Login onLogin={handleLogin} />;
}
