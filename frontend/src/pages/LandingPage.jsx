import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, ShieldCheck, Trophy } from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      title: "Tokenized Engagement",
      description: "Earn custom campus tokens for attending events and contributing to the community.",
      icon: <Zap className="text-neon-cyan" size={32} />,
    },
    {
      title: "Secure & Transparent",
      description: "Blockchain-backed verification ensures your tokens and attendance are tamper-proof.",
      icon: <ShieldCheck className="text-neon-blue" size={32} />,
    },
    {
      title: "Exclusive Rewards",
      description: "Redeem your tokens for exclusive access, merch, or SHM cashouts directly in-app.",
      icon: <Trophy className="text-neon-purple" size={32} />,
    },
  ];

  return (
    <div className="min-h-screen bg-dark-900 text-white overflow-hidden font-sans">
      {/* Animated Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-neon-purple/20 rounded-full blur-[150px] opacity-50 mix-blend-screen animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-neon-blue/20 rounded-full blur-[150px] opacity-50 mix-blend-screen animate-pulse pointer-events-none" />

      {/* Navigation Bar */}
      <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tighter text-gradient">Parva</h1>
        <div className="flex gap-4">
          <Link to="/login" className="btn-outline">
            Login
          </Link>
          <Link to="/login" className="btn-primary">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-32 pb-24 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-neon-cyan text-sm font-medium mb-6">
            Welcome to the Future of Campus Economy
          </span>
          <h2 className="text-6xl md:text-8xl font-extrabold tracking-tight leading-tight mb-8">
            Build. <span className="text-gradient">Engage.</span> Earn.
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12">
            The next-generation tokenized ecosystem. Participate in events, earn rewards, and own your engagement.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/login" className="btn-primary text-xl px-10 py-4">
              Get Started
            </Link>
            <Link to="/events" className="btn-outline text-xl px-10 py-4 bg-white/5 backdrop-blur-sm">
              Explore Events
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Feature Highlights */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="glass-panel p-8 hover:shadow-neon-blue transition-all duration-300 transform hover:-translate-y-2 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/10">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed text-lg">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
