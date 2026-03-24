import { useEffect, useState } from "react";
import { api } from "../api/client";
import { Users, Ticket, Activity, Coins, CheckCircle, PlusCircle, ArrowRightLeft } from "lucide-react";
import { motion } from "framer-motion";

const emptyForm = { title: "", description: "", event_date: "", reward_tokens: 0 };

export default function AdminPage() {
  const [stats, setStats] = useState({ total_users: 120, total_events: 15, total_attendance: 450, tokens_distributed: 8500 });
  const [cashouts, setCashouts] = useState([
    { id: 1, user_id: 42, tokens_requested: 500, status: "pending" },
    { id: 2, user_id: 18, tokens_requested: 200, status: "approved" },
  ]);
  const [form, setForm] = useState(emptyForm);

  async function load() {
    try {
      const [a, c] = await Promise.all([api.get("/admin/analytics"), api.get("/cashout/requests")]);
      setStats(a.data);
      setCashouts(c.data);
    } catch {
      // Keep mock data if backend fails
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function approve(id) {
    try {
      await api.post(`/cashout/approve/${id}`);
      load();
    } catch {
      setCashouts(c => c.map(req => req.id === id ? { ...req, status: "approved" } : req));
      alert("Cashout approved (Mock)");
    }
  }

  async function createEvent(e) {
    e.preventDefault();
    try {
      await api.post("/events", { ...form, reward_tokens: Number(form.reward_tokens) });
      setForm(emptyForm);
      load();
      alert("Event created successfully");
    } catch {
      alert("Event creation simulated (Mock mode)");
      setForm(emptyForm);
    }
  }

  const statCards = [
    { title: "Total Users", value: stats?.total_users || 0, icon: <Users size={24} className="text-neon-cyan" /> },
    { title: "Total Events", value: stats?.total_events || 0, icon: <Ticket size={24} className="text-neon-purple" /> },
    { title: "Attendance", value: stats?.total_attendance || 0, icon: <Activity size={24} className="text-neon-blue" /> },
    { title: "Tokens Distributed", value: stats?.tokens_distributed || 0, icon: <Coins size={24} className="text-neon-cyan" /> },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Manage platform analytics, events, and cashouts.</p>
      </header>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={idx} 
            className="glass-panel p-6 flex items-center justify-between group hover:shadow-neon-blue transition-all"
          >
            <div>
              <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
              {stat.icon}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Event Form */}
        <div className="glass-panel p-8 relative overflow-hidden">
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-neon-purple/10 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <PlusCircle size={24} className="text-neon-purple" />
            <h2 className="text-xl font-bold">Create New Event</h2>
          </div>

          <form className="space-y-4 relative z-10" onSubmit={createEvent}>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Event Title</label>
              <input 
                required
                className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-purple transition-colors" 
                placeholder="E.g. Web3 Workshop" 
                value={form.title} 
                onChange={(e) => setForm({ ...form, title: e.target.value })} 
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Description</label>
              <textarea 
                required
                className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-purple transition-colors min-h-[100px]" 
                placeholder="Event details..." 
                value={form.description} 
                onChange={(e) => setForm({ ...form, description: e.target.value })} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Date & Time</label>
                <input 
                  required
                  type="datetime-local" 
                  className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-purple transition-colors" 
                  value={form.event_date} 
                  onChange={(e) => setForm({ ...form, event_date: e.target.value })} 
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Reward Tokens</label>
                <input 
                  required
                  type="number" 
                  min="0"
                  className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-purple transition-colors" 
                  placeholder="50" 
                  value={form.reward_tokens} 
                  onChange={(e) => setForm({ ...form, reward_tokens: e.target.value })} 
                />
              </div>
            </div>
            <button className="w-full btn-primary mt-2">Publish Event</button>
          </form>
        </div>

        {/* Cashout Requests */}
        <div className="glass-panel p-8">
          <div className="flex items-center gap-3 mb-6">
            <ArrowRightLeft size={24} className="text-neon-cyan" />
            <h2 className="text-xl font-bold">Pending Cashouts</h2>
          </div>

          <div className="space-y-3">
            {cashouts.filter(c => c.status === "pending").length === 0 ? (
              <div className="text-center py-10 text-gray-500 bg-dark-800/50 rounded-xl border border-white/5 text-sm">
                No pending requests.
              </div>
            ) : (
              cashouts.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-xl bg-dark-800/80 border border-white/5 p-4 hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-mono text-sm text-gray-400">
                      #{c.user_id}
                    </div>
                    <div>
                      <div className="font-bold text-white">{c.tokens_requested} Tokens</div>
                      <div className="text-xs text-gray-400">Status: {c.status}</div>
                    </div>
                  </div>
                  {c.status === "pending" && (
                    <button 
                      className="px-4 py-2 bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan hover:text-dark-900 rounded-lg font-semibold transition-colors flex items-center gap-2 text-sm" 
                      onClick={() => approve(c.id)}
                    >
                      <CheckCircle size={16} /> Approve
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
