import React from "react";
import { Wallet, ArrowUpRight, ArrowDownLeft } from "lucide-react";

export default function WalletPage() {
  const transactions = [
    { id: 1, type: "Earned", amount: "+50", event: "Web3 Hackathon", date: "Oct 24, 2026" },
    { id: 2, type: "Redeemed", amount: "-200", event: "Exclusive Merch", date: "Oct 22, 2026" },
    { id: 3, type: "Earned", amount: "+10", event: "Community Call", date: "Oct 20, 2026" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-sans">Your Wallet</h1>
        <p className="text-gray-400">Manage your tokens and track your history</p>
      </header>

      {/* Hero Balance Card */}
      <div className="glass-panel p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/10 rounded-full blur-[80px] group-hover:bg-neon-cyan/20 transition-all duration-700 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Wallet size={20} className="text-neon-cyan" />
              <span className="font-medium tracking-wider uppercase text-sm">Total Balance</span>
            </div>
            <div className="text-6xl md:text-8xl font-black text-gradient flex items-baseline gap-2">
              1,250
              <span className="text-2xl text-neon-cyan font-bold lowercase tracking-normal">tokens</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <button className="btn-primary flex justify-center items-center gap-2">
              <ArrowUpRight size={20} /> Transfer
            </button>
            <button className="btn-outline flex justify-center items-center gap-2">
              <ArrowDownLeft size={20} /> Receive
            </button>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-white">Transaction History</h2>
        <div className="glass-panel overflow-hidden">
          <div className="divide-y divide-white/5">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl flex items-center justify-center ${
                    tx.type === "Earned" ? "bg-neon-cyan/10 text-neon-cyan" : "bg-neon-purple/10 text-neon-purple"
                  }`}>
                    {tx.type === "Earned" ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-100">{tx.event}</h4>
                    <p className="text-sm text-gray-400">{tx.date}</p>
                  </div>
                </div>
                <div className={`text-xl font-bold ${
                  tx.type === "Earned" ? "text-neon-cyan" : "text-white"
                }`}>
                  {tx.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
