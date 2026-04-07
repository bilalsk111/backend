import { Navigate } from "react-router-dom";
import { loginWithGoogle } from "../api/google.auth.api";
import { Swords, ShieldCheck, Lock, Fingerprint } from "lucide-react";

export default function Login() {
  // ✅ Already logged in? Redirect
  if (localStorage.getItem("token")) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="h-screen flex items-center justify-center bg-[#050508] text-white overflow-hidden font-sans">
      
      {/* ── Background Elements ───────────────────────────────────────────── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

      {/* ── Login Card ────────────────────────────────────────────────────── */}
      <div className="relative group w-[400px] animate-in fade-in zoom-in-95 duration-700">
        
        {/* Decorative Outer Border Glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-b from-indigo-500/20 to-transparent rounded-[2.5rem] blur opacity-50 group-hover:opacity-100 transition duration-1000" />

        <div className="relative bg-[#0a0a0f] border border-white/[0.08] p-10 rounded-[2.5rem] shadow-2xl space-y-10 overflow-hidden">
          
          {/* Animated Scanning Line */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-20 animate-scan pointer-events-none" />

          {/* Header Section */}
          <div className="text-center space-y-6">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full" />
              <div className="relative w-20 h-20 mx-auto rounded-[2rem] bg-zinc-900 border border-white/10 flex items-center justify-center shadow-2xl">
                <Swords size={32} className="text-indigo-400" strokeWidth={1.5} />
              </div>
              <div className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-indigo-500 text-black border-4 border-[#0a0a0f]">
                <Lock size={12} fill="black" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tighter uppercase italic">
                Arena <span className="text-indigo-500 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Access</span>
              </h1>
              <div className="flex items-center justify-center gap-2">
                <span className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse" />
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">
                  Security Protocol v4.0.2
                </p>
              </div>
            </div>
          </div>

          {/* Google Login Button */}
          <div className="space-y-4">
            <button
              onClick={loginWithGoogle}
              className="group/btn relative w-full flex items-center justify-center gap-4 bg-white text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-200 active:scale-[0.98] transition-all duration-200 overflow-hidden"
            >
              <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-[45deg] -translate-x-[150%] group-hover/btn:translate-x-[250%] transition-transform duration-1000" />
              <GoogleIcon />
              Authorize with Google
            </button>

            <div className="flex items-center gap-4 text-zinc-600 px-2">
              <div className="h-px bg-white/5 flex-1" />
              <span className="text-[9px] font-black uppercase tracking-widest">Encrypted Session</span>
              <div className="h-px bg-white/5 flex-1" />
            </div>
          </div>

          {/* Bottom Security Badges */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: <ShieldCheck size={12} />, label: "Verified" },
              { icon: <Fingerprint size={12} />, label: "Biometric" },
              { icon: <Lock size={12} />, label: "AES-256" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="text-zinc-500">{item.icon}</div>
                <span className="text-[8px] font-black text-zinc-700 uppercase tracking-tighter">{item.label}</span>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-zinc-600 text-center font-mono uppercase tracking-tighter">
            Establishing secure handshake... <span className="text-indigo-900">READY</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" className="group-hover:rotate-[360deg] transition-transform duration-700">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
      <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.962L3.964 6.294C4.672 4.167 6.656 3.58 9 3.58z"/>
    </svg>
  );
}