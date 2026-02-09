"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { login, signup } from "./actions";
import { Flame, Zap, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Efek untuk membersihkan error saat pindah mode
  useEffect(() => {
    setError(null);
  }, [isLogin]);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    try {
      const result = isLogin ? await login(formData) : await signup(formData);
      if (result?.error) {
        setError(result.error);
      }
    } catch {
      // Redirect happened
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0505] relative overflow-hidden font-sans selection:bg-red-500 selection:text-white">
      
      {/* === BACKGROUND ELEMENTS === */}
      {/* Gambar Background Samar */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/header-bg-new.png" 
          alt="Background" 
          fill 
          className="object-cover opacity-20 scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0505] via-[#0a0505]/90 to-red-950/40 mix-blend-multiply"></div>
      </div>

      {/* Grid Pattern Halus */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ff000005_1px,transparent_1px),linear-gradient(to_bottom,#ff000005_1px,transparent_1px)] bg-[size:4rem_4rem] z-0 pointer-events-none"></div>

      {/* === CONTENT CONTAINER === */}
      <div className="w-full max-w-md px-6 relative z-10">
        
        {/* Logo / Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/50 border border-red-500/30 backdrop-blur-md text-orange-400 text-xs font-bold uppercase tracking-[0.2em] mb-6 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
             <Flame className="w-4 h-4 animate-pulse" />
             <span>SYSTEM ACCESS</span>
          </div>
          
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">
            Klas<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Konstruksi</span>
          </h1>
          <p className="text-red-200/60 mt-2 text-sm font-mono tracking-widest uppercase">
            Start Your Legend Here
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-[#1a0505]/60 backdrop-blur-xl border border-red-500/30 rounded-2xl shadow-[0_0_40px_rgba(220,38,38,0.15)] p-8 relative overflow-hidden group">
          
          {/* Hiasan Sudut Tech */}
          <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-red-500/10 to-transparent -z-10"></div>
          
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
            {isLogin ? "LOGIN ACCESS" : "NEW PLAYER REGISTRATION"}
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse ml-auto"></span>
          </h2>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-950/50 border border-red-500 text-red-200 rounded-lg text-sm flex items-start gap-3">
              <div className="mt-0.5"><Zap className="w-4 h-4 text-red-500" /></div>
              {error}
            </div>
          )}

          {/* Success Message from URL */}
          <MessageFromURL />

          {/* Form */}
          <form action={handleSubmit} className="space-y-5">
            
            {/* Full Name - Only for Signup */}
            {!isLogin && (
              <div>
                <label htmlFor="fullName" className="block text-xs font-bold text-red-300 uppercase tracking-wider mb-2 ml-1">
                  Agent Name
                </label>
                <div className="relative group/input">
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your codename"
                    className="w-full px-4 py-3 bg-[#0a0505] border border-red-500/30 rounded-lg text-white placeholder-red-900/50 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition duration-300"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-red-300 uppercase tracking-wider mb-2 ml-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@server.com"
                required
                className="w-full px-4 py-3 bg-[#0a0505] border border-red-500/30 rounded-lg text-white placeholder-red-900/50 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition duration-300"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-red-300 uppercase tracking-wider mb-2 ml-1">
                Access Key (Password)
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 py-3 bg-[#0a0505] border border-red-500/30 rounded-lg text-white placeholder-red-900/50 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition duration-300"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden bg-gradient-to-r from-red-600 to-orange-600 text-white py-4 px-4 rounded-lg font-black uppercase tracking-wider hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(251,146,60,0.6)]"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    Connecting...
                  </>
                ) : isLogin ? (
                  <>
                    INITIATE LOGIN <ArrowRight className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    JOIN THE SYSTEM <Zap className="w-5 h-5 fill-white" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-red-500/20"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="px-4 bg-[#150a0a] text-red-500/60">Or</span>
            </div>
          </div>

          {/* Toggle Login/Signup */}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="w-full py-3 px-4 border border-red-500/20 rounded-lg font-bold text-red-300 hover:text-white hover:bg-red-500/10 hover:border-red-500/50 transition duration-300 text-sm uppercase tracking-wide"
          >
            {isLogin ? "Create New Profile" : "Already Registered? Login"}
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-red-900/60 text-xs mt-8 font-mono uppercase tracking-widest">
          &copy; 2026 KlasKonstruksi Systems. <br/> Dev. by Askara Indonesia
        </p>
      </div>
    </div>
  );
}

// Separate component to handle URL message
function MessageFromURL() {
  if (typeof window === "undefined") return null;
  
  const params = new URLSearchParams(window.location.search);
  const message = params.get("message");
  
  if (!message) return null;
  
  return (
    <div className="mb-6 p-4 bg-green-950/30 border border-green-500/50 text-green-400 rounded-lg text-sm flex items-start gap-3 backdrop-blur-sm">
      <div className="mt-0.5"><Zap className="w-4 h-4" /></div>
      {message}
    </div>
  );
}