import React, { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom"; 
import { Eye, EyeOff, Mail, Lock, Loader2, AlertTriangle } from "lucide-react";
import { useAuth } from "../hook/useAuth";
import { useSelector } from "react-redux";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [uiError, setUiError] = useState("");

  const loading = useSelector(state => state.auth.loading);
  const user = useSelector(state => state.auth.user);
  
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const handleCustomSubmit = async (e) => {
      e?.preventDefault(); // Extra safety
      setUiError(""); 

      if (!email || !password) {
          setUiError("Please fill in both fields.");
          return;
      }

      const payload = { email, password };
      
      try {
          const result = await handleLogin(payload);     
          if (result && result.success === true) {
              navigate("/", { replace: true });
          } else {
              setUiError(result?.errorMsg || "Invalid credentials or email not verified.");
          }
      } catch (err) {
          setUiError("Server issue.");
      }
  };

  if (user) {
      return <Navigate to="/" replace />;
  }

  return (
    <section className="min-h-screen bg-[#050505] flex items-center justify-center px-4 py-10 text-zinc-100">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#31b8c6]/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-8 shadow-2xl backdrop-blur-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">Welcome Back</h1>
          </div>

          <div className="space-y-6">
            
            {uiError && (
              <div className="flex items-start gap-3 rounded-xl bg-red-500/10 border border-red-500/30 p-4 mb-4 text-red-400">
                <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                <p className="text-sm font-medium leading-relaxed">{uiError}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/50 pl-10 pr-4 py-3 text-sm outline-none focus:border-[#31b8c6]/50 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/50 pl-10 pr-12 py-3 text-sm outline-none focus:border-[#31b8c6]/50 transition-colors"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={handleCustomSubmit}
              className="w-full rounded-xl bg-[#31b8c6] px-4 py-3.5 font-bold text-zinc-950 hover:bg-[#45c7d4] disabled:opacity-70 flex justify-center items-center gap-2 transition-all active:scale-[0.98]"
            >
              {loading ? <><Loader2 className="animate-spin" size={20} /> Checking...</> : "Sign In"}
            </button>
            
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-zinc-500">
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold text-[#31b8c6] hover:text-[#45c7d4] transition-colors">
                Create Account
              </Link>
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Login;