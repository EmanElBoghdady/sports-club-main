"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { findUserByEmail, setAuthToken, setCurrentUser } from "@/lib/auth";
import FeatureCard from "./FeatureCard";
import {
  UserGroupIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";

export default function LoginPreview() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState({ email: false, password: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const user = findUserByEmail(email);
    if (!user) {
      setError("No account with this email. Please sign up.");
      setLoading(false);
      return;
    }
    if (user.password !== password) {
      setError("Invalid password.");
      setLoading(false);
      return;
    }
    const token = "fake-jwt-token-" + Date.now();
    setAuthToken(token);
    setCurrentUser({ name: user.name, email: user.email });
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex">

      <div className="hidden lg:flex lg:w-[55%] relative">


        <Image
          src="/sportify/yy.jpg"
          alt="volleyball"
          fill
          className="object-cover "
          priority
          sizes="55vw"

        />

        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/80 via-teal-900/60 to-blue-900/80  z-10" />


        <div className="absolute inset-0 z-20 flex flex-col justify-between p-10 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <Image
              src="/sportify/logo2-removebg-preview.png"
              alt="Sportify"
              width={100}
              height={100}
              className="object-contain drop-shadow-lg bg-transparent"
              style={{ background: "none" }}
            />
            <span className="text-8xl font-black italic pb-2 text-center bg-gradient-to-r from-emerald-500 via-teal-300 to-cyan-300 bg-clip-text text-transparent">Sportify </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              Your sports hub <br />reimagined.
            </h1>
            <p className="text-white/85 text-lg max-w-sm">
              Manage teams, track performance, and bring your club to the next level.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <FeatureCard icon={<UserGroupIcon className="h-7 w-7 text-white" />} text="Active players & staff" />
              <FeatureCard icon={<ChartBarIcon className="h-7 w-7 text-white" />} text="Performance tracking" />
              <FeatureCard icon={<TrophyIcon className="h-7 w-7 text-white" />} text="Football, Basketball, Handball" />
              <FeatureCard icon={<ShieldCheckIcon className="h-7 w-7 text-white" />} text="Role-based permissions" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex gap-6 text-sm"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              <span>Multi-sport support</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-teal-300 animate-pulse" style={{ animationDelay: "0.3s" }} />
              <span>Real-time analytics</span>
            </div>
          </motion.div>
        </div>

      </div>


      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-slate-950"
      >
        <div className="w-full max-w-md space-y-8">

          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <span className="text-4xl font-black italic bg-gradient-to-r text-center from-emerald-500 via-teal-400 to-cyan-400 bg-clip-text text-transparent">Sportify</span>
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent text-center">Welcome back</h2>
            <p className="text-slate-500 mt-2 text-center font-medium tracking-wide">Sign in to continue to your dashboard</p>
          </div>

          <motion.form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2"
              >
                <span className="text-red-500">!</span>
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500">Email Address</label>
              <div
                className={`relative rounded-2xl border bg-slate-900/50 transition-all duration-300 ${focused.email
                    ? "border-emerald-500 ring-4 ring-emerald-500/10 shadow-lg shadow-emerald-500/20"
                    : "border-slate-800"
                  }`}
              >
                <input
                  type="email"
                  placeholder="you@sportify.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused((f) => ({ ...f, email: true }))}
                  onBlur={() => setFocused((f) => ({ ...f, email: false }))}
                  className="w-full px-4 py-3.5 rounded-2xl outline-none bg-transparent text-slate-800 placeholder:text-slate-600"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500">Password</label>
              <div
                className={`relative rounded-2xl border bg-slate-900/50 transition-all duration-300 ${focused.password
                    ? "border-emerald-500 ring-4 ring-emerald-500/10 shadow-lg shadow-emerald-500/20"
                    : "border-slate-800"
                  }`}
              >
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused((f) => ({ ...f, password: true }))}
                  onBlur={() => setFocused((f) => ({ ...f, password: false }))}
                  className="w-full px-4 py-3.5 rounded-2xl outline-none bg-transparent text-slate-800 placeholder:text-slate-600"
                  required
                />
              </div>
              <div className="text-right">
                <button type="button" className="text-sm text-emerald-700 hover:text-emerald-800 font-medium">
                  Forgot password?
                </button>
              </div>
            </div>


            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-semibold shadow-lg shadow-emerald-700/30
               hover:shadow-xl hover:shadow-emerald-700/40 disabled:opacity-70 transition-all
                flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </motion.button>
          </motion.form>

          <p className="text-center text-slate-500 text-sm font-medium tracking-wide">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-emerald-400 hover:text-emerald-300 transition-colors font-bold ml-1 decoration-emerald-400/30 underline-offset-4 hover:underline">
              Create One..
            </Link>
          </p>

        </div>
      </motion.div>
    </div>
  );
}