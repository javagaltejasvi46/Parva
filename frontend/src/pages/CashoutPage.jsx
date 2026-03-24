import React, { useState } from "react";
import { api } from "../api/client";
import { ArrowRightLeft, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function CashoutPage() {
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("idle");

  const conversionRate = 0.05; // 1 Reva Token = 0.05 SHM
  const estimatedSHM = amount ? (parseFloat(amount) * conversionRate).toFixed(3) : "0.000";

  const handleCashout = async () => {
    setStatus("processing");
    try {
      await api.post("/cashout/request", { tokens_requested: Number(amount) });
      setStatus("success");
      setAmount("");
    } catch (error) {
      alert("Cashout failed: " + (error?.response?.data?.detail || error.message));
      setStatus("idle");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold font-sans mb-2">Cashout Reva</h1>
        <p className="text-gray-400">Convert your earned Reva tokens into SHM</p>
      </header>

      <div className="glass-panel p-8 md:p-10 relative overflow-hidden text-center">
        {status === "success" ? (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center py-10"
          >
            <div className="w-24 h-24 bg-neon-cyan/20 rounded-full flex items-center justify-center mb-6 shadow-neon-blue">
              <CheckCircle2 size={48} className="text-neon-cyan" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Success!</h2>
            <p className="text-gray-400 text-lg">Your Reva tokens have been successfully converted to SHM.</p>
            <button onClick={() => setStatus("idle")} className="btn-outline mt-8 px-8 py-3">
              Cashout Again
            </button>
          </motion.div>
        ) : (
          <div className="space-y-8 text-left">
            <div className="space-y-4">
              <label className="block text-sm font-medium tracking-widest text-gray-400 uppercase">
                Amount to Cashout
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-dark-800 border-2 border-white/10 rounded-xl px-6 py-5 text-4xl font-bold text-white placeholder-gray-600 focus:outline-none focus:border-neon-purple focus:shadow-[0_0_15px_rgba(176,38,255,0.3)] transition-all"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-neon-cyan font-bold text-xl">
                  REVA
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center py-4 text-gray-500">
              <ArrowRightLeft size={32} />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium tracking-widest text-gray-400 uppercase">
                Estimated SHM
              </label>
              <div className="w-full bg-dark-900 border border-white/5 rounded-xl px-6 py-5 flex justify-between items-center text-gray-300">
                <span className="text-4xl font-bold">{estimatedSHM}</span>
                <span className="text-xl font-medium">SHM</span>
              </div>
            </div>

            <button 
              onClick={handleCashout}
              disabled={!amount || status === "processing"}
              className={`w-full py-5 text-xl relative overflow-hidden ${
                status === "processing" ? "bg-gray-600 cursor-not-allowed text-gray-300 rounded-xl" : "btn-primary"
              }`}
            >
              {status === "processing" ? "Processing..." : "Confirm Cashout"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
