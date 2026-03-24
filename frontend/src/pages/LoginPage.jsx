import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, Mail, CreditCard, ChevronRight } from "lucide-react";

export default function LoginPage() {
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", name: "", college_id: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "register") {
        await register({ ...form, role: "student" });
      }
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (error) {
      alert("Authentication failed. Please check your credentials.");
      setLoading(false);
    }
  }

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setForm({ email: "", password: "", name: "", college_id: "" });
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background glowing orbs */}
      <div className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] bg-neon-purple/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[40vw] h-[40vw] bg-neon-cyan/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10 relative z-10">
          <h1 className="text-4xl font-extrabold text-gradient mb-2 tracking-tight">Parva</h1>
          <p className="text-gray-400 font-medium tracking-wide text-sm uppercase">Tokenized Campus Ecosystem</p>
        </div>

        <div className="glass-panel p-8 md:p-10 relative z-10 hidden-scrollbar overflow-y-auto max-h-[80vh]">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-gray-400 text-sm">
              {mode === "login" 
                ? "Enter your credentials to access your wallet and events." 
                : "Join the network to start earning campus tokens."}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <AnimatePresence mode="popLayout">
              {mode === "register" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-5"
                >
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <User size={18} />
                    </div>
                    <input 
                      required
                      className="w-full bg-dark-800/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple transition-colors" 
                      placeholder="Full Name" 
                      onChange={(e) => setForm({ ...form, name: e.target.value })} 
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <CreditCard size={18} />
                    </div>
                    <input 
                      required
                      className="w-full bg-dark-800/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple transition-colors" 
                      placeholder="College ID" 
                      onChange={(e) => setForm({ ...form, college_id: e.target.value })} 
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Mail size={18} />
              </div>
              <input 
                required
                type="email"
                className="w-full bg-dark-800/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition-colors" 
                placeholder="Email Address" 
                onChange={(e) => setForm({ ...form, email: e.target.value })} 
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <input 
                required
                type="password" 
                className="w-full bg-dark-800/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition-colors" 
                placeholder="Password" 
                onChange={(e) => setForm({ ...form, password: e.target.value })} 
              />
            </div>

            <button 
              disabled={loading}
              className={`w-full btn-primary flex items-center justify-center gap-2 mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`} 
              type="submit"
            >
              {loading ? "Processing..." : (mode === "login" ? "Login to Ecosystem" : "Register and Enter")}
              {!loading && <ChevronRight size={18} />}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-gray-400">
              {mode === "login" ? "New to Parva?" : "Already a member?"}
            </span>
            {" "}
            <button 
              className="text-neon-cyan hover:text-neon-blue font-semibold transition-colors focus:outline-none" 
              onClick={toggleMode}
              type="button"
            >
              {mode === "login" ? "Create an account" : "Sign in here"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
