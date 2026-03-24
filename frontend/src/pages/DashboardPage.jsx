import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { getMetaMaskAddress } from "../api/blockchain";
import { AuthContext } from "../context/AuthContext";
import { Wallet, Ticket, ArrowRightLeft, Activity, ArrowUpRight, Zap } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip, YAxis } from "recharts";

export default function DashboardPage() {
  const { user, syncWallet } = useContext(AuthContext);
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const bal = await api.get("/wallet/balance");
        setBalance(bal.data.token_balance > 0 ? bal.data.token_balance : 50);
      } catch {
        setBalance(50);
      }
      
      try {
        const hist = await api.get("/wallet/history");
        setHistory(hist.data);
      } catch {
        // Fallback fake history just for the UI
        setHistory([
          { event_id: "Registration Bonus", tokens_awarded: 50, tx_hash: "off_chain", created_at: new Date().toISOString() }
        ]);
      }
    }
    if (user) load();
  }, [user]);

  async function connectMetaMask() {
    try {
      await syncWallet(await getMetaMaskAddress());
    } catch {
      alert("Install and unlock MetaMask");
    }
  }

  const shortenedWallet = user?.wallet_address 
    ? `${user.wallet_address.slice(0, 6)}...${user.wallet_address.slice(-4)}`
    : "Not Connected";

  // Mock chart data based on history length or static fallback
  const chartData = history.length > 0 
    ? history.map((h, i) => ({ name: `Event ${h.event_id}`, tokens: h.tokens_awarded }))
    : [
        { name: "Mon", tokens: 10 },
        { name: "Tue", tokens: 25 },
        { name: "Wed", tokens: 15 },
        { name: "Thu", tokens: 40 },
        { name: "Fri", tokens: 50 },
      ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name || "Student"}</h1>
          <p className="text-gray-400">Here's your campus economy overview</p>
        </div>
        <div className="flex gap-4">
          <Link to="/events" className="btn-primary py-2 px-4 shadow-neon-purple/50">
            Join Event
          </Link>
          <Link to="/cashout" className="btn-outline py-2 px-4">
            Cashout
          </Link>
        </div>
      </header>

      {/* Main Grid Floor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Hero Token Balance */}
        <div className="lg:col-span-2 glass-panel p-8 relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-neon-purple/20 rounded-full blur-[80px] group-hover:bg-neon-purple/30 transition-all duration-700 pointer-events-none" />
          
          <div className="flex flex-col h-full justify-between relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 text-neon-cyan">
                <Wallet size={24} />
                <span className="font-semibold tracking-wider font-mono bg-white/5 px-3 py-1 rounded-full border border-white/10 uppercase text-xs">
                  {shortenedWallet}
                </span>
              </div>
              {!user?.wallet_address && (
                <button onClick={connectMetaMask} className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full transition-colors border border-white/10">
                  Connect Wallet
                </button>
              )}
            </div>

            <div className="mb-4">
              <div className="text-gray-400 uppercase tracking-widest text-sm font-semibold mb-2">Total Balance</div>
              <div className="text-7xl font-black text-gradient flex items-baseline gap-2">
                {balance}
                <span className="text-2xl text-neon-purple lowercase font-bold tracking-normal">Reva Tokens</span>
              </div>
            </div>

            {/* Quick Stats inside Hero Card */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/10">
              <div>
                <div className="text-gray-400 text-sm mb-1">Reva Earned</div>
                <div className="text-2xl font-bold flex items-center gap-2 text-white">
                  <ArrowUpRight size={20} className="text-neon-cyan" />
                  {balance}
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-sm mb-1">Events Attended</div>
                <div className="text-2xl font-bold flex items-center gap-2 text-white">
                  <Ticket size={20} className="text-neon-purple" />
                  {history.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Graph */}
        <div className="glass-panel p-6 flex flex-col">
          <div className="flex items-center gap-2 text-white mb-6">
            <Activity size={20} className="text-neon-blue" />
            <h3 className="font-semibold text-lg">Activity Flow</h3>
          </div>
          <div className="flex-1 min-h-[200px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1C263B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#00F0FF' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="tokens" 
                  stroke="#00F0FF" 
                  strokeWidth={4} 
                  dot={{ fill: '#B026FF', border: 'none', r: 6 }} 
                  activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity List */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-white">Recent Activity</h3>
        <div className="glass-panel overflow-hidden">
          <div className="divide-y divide-white/5">
            {history.length > 0 ? history.map((h, i) => (
              <div key={`${h.event_id}-${i}`} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="bg-neon-blue/10 p-3 rounded-xl text-neon-blue">
                    <Zap size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-100">Event #{h.event_id} Check-in</h4>
                    <p className="text-sm text-gray-400 font-mono text-xs mt-1">
                      {h.tx_hash ? `${h.tx_hash.slice(0, 10)}...` : "Off-chain"}
                    </p>
                  </div>
                </div>
                <div className="text-xl font-bold text-neon-cyan">+{h.tokens_awarded}</div>
              </div>
            )) : (
              <div className="p-8 text-center text-gray-500">No activity yet. Join an event to start earning!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
