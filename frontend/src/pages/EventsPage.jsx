import { useEffect, useState } from "react";
import { api } from "../api/client";
import { QrCode, Ticket, Calendar, Clock, MapPin, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);

  async function load() {
    try {
      const { data } = await api.get("/events");
      setEvents(data);
    } catch {
      // Mock data if backend is unreachable
      setEvents([
        { id: 1, title: "Web3 Campus Hackathon", description: "Build the future of decentralized apps. Join teams and win campus tokens.", event_date: "2026-10-24T10:00:00Z", reward_tokens: 50 },
        { id: 2, title: "Blockchain 101 Seminar", description: "Learn the basics of smart contracts, wallets, and ecosystem economics.", event_date: "2026-10-26T14:00:00Z", reward_tokens: 15 },
        { id: 3, title: "Community Meetup", description: "Network with other token holders and project builders on campus.", event_date: "2026-10-28T18:00:00Z", reward_tokens: 10 },
      ]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function rsvp(eventId) {
    try {
      await api.post(`/events/${eventId}/rsvp`);
      alert("RSVP successful!");
    } catch {
      alert("RSVP simulated (Mock mode)");
    }
  }

  const handleCheckIn = (ev) => {
    setSelectedEvent(ev);
    setShowQrModal(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">Discover Events</h1>
          <p className="text-gray-400">Attend events to earn tokens and rank up.</p>
        </div>
        <div className="flex gap-2 relative">
          <input 
            type="text" 
            placeholder="Search events..." 
            className="bg-dark-800 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-neon-cyan focus:outline-none w-64"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((ev, idx) => {
          const dateObj = new Date(ev.event_date);
          const dateStr = dateObj.toLocaleDateString();
          const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={ev.id} 
              className="glass-panel overflow-hidden flex flex-col group"
            >
              {/* Event Image Placeholder / Header Area */}
              <div className="h-40 bg-gradient-to-br from-dark-800 to-dark-700 relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop')] opacity-20 bg-cover bg-center mix-blend-overlay" />
                <div className="absolute top-4 right-4 bg-neon-purple/20 text-neon-purple border border-neon-purple/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1 shadow-neon-purple">
                  <Ticket size={14} />
                  +{ev.reward_tokens} Tokens
                </div>
              </div>

              {/* Event Content */}
              <div className="p-6 flex-1 flex flex-col">
                <h4 className="text-xl font-bold text-white mb-3 line-clamp-2">{ev.title}</h4>
                <p className="text-sm text-gray-400 mb-6 flex-1 line-clamp-3">{ev.description}</p>
                
                <div className="space-y-2 mb-6 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-neon-cyan" />
                    <span>{dateStr}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-neon-cyan" />
                    <span>{timeStr}</span>
                  </div>
                </div>

                <div className="flex gap-3 mt-auto">
                  <button 
                    onClick={() => rsvp(ev.id)}
                    className="flex-1 btn-primary py-2 text-sm"
                  >
                    RSVP
                  </button>
                  <button 
                    onClick={() => handleCheckIn(ev)}
                    className="flex-1 btn-outline py-2 text-sm flex items-center justify-center gap-2"
                  >
                    <QrCode size={16} /> Check-in
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* QR Code Modal for Check-in */}
      <AnimatePresence>
        {showQrModal && selectedEvent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-panel max-w-sm w-full p-8 relative"
            >
              <button 
                onClick={() => setShowQrModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-neon-cyan/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-neon-cyan shadow-neon-blue">
                  <QrCode size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Scan to Check-in</h3>
                <p className="text-sm text-gray-400 mb-8">
                  Present this QR code at the event entrance to claim your {selectedEvent.reward_tokens} tokens for <strong>{selectedEvent.title}</strong>.
                </p>

                {/* Simulated QR Code Visual */}
                <div className="bg-white p-4 rounded-xl inline-block mb-6 shadow-neon-cyan">
                  <div className="w-48 h-48 bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=MockCheckinData123')] bg-cover" />
                </div>

                <div className="text-xs text-gray-500 font-mono">
                  Ticket ID: {selectedEvent.id}-TXN-{Math.floor(Math.random()*10000)}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
