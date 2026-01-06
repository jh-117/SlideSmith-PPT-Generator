import { Button } from "./ui/button";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import BackgroundMusic from './BackgroundMusic';
import themeMusic from '../assets/slidesmith-theme.mp3';
import kadoshLogo from '../assets/kadoshAI.png';

interface HeroProps {
  onStart: () => void;
  onPrivacyPolicyClick: () => void;
}

export function Hero({ onStart, onPrivacyPolicyClick }: HeroProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Hero Content */}
      <div className="flex-grow relative flex flex-col items-center justify-center text-center p-6 overflow-hidden">
        <BackgroundMusic src={themeMusic} />
        
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900/50 via-[#0f111a] to-[#0f111a]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
        
        {/* Glow Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
              <span className="text-sm font-medium tracking-widest uppercase text-primary/80">
                AI-Powered Presentation Architect
              </span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white mb-6 drop-shadow-[0_0_15px_rgba(56,189,248,0.3)]">
              Slide<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Smith</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              AI-powered executive slide deck creator — from brief to full PPTX with visuals in minutes.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
            <Button 
              onClick={onStart}
              size="lg" 
              className="relative px-8 py-8 text-lg bg-background border border-orange-500/50 text-orange-100 hover:bg-orange-950/30 hover:text-white hover:border-orange-400 transition-all shadow-[0_0_20px_rgba(249,115,22,0.1)]"
            >
              GENERATE DECK <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-16 relative rounded-xl overflow-hidden border border-slate-800 shadow-2xl shadow-blue-900/20"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f111a] via-transparent to-transparent z-10" />
            <img 
              src="https://images.unsplash.com/photo-1670383050616-682df7d57b22?q=80&w=2000&auto=format&fit=crop" 
              alt="Dashboard Preview" 
              className="w-full object-cover opacity-60"
            />
          </motion.div>
        </div>
      </div>

      {/* Footer - Only on Hero Page */}
      <footer className="relative z-10 bg-[#0f111a] border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center space-y-6">
            
            {/* Privacy Policy Link */}
            <div className="text-center">
              <button
                onClick={onPrivacyPolicyClick}
                className="text-slate-400 hover:text-blue-400 font-medium transition-colors text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-3 py-1.5"
              >
                Privacy Policy
              </button>
            </div>

            {/* Powered By Section */}
            <div className="flex flex-col items-center space-y-2">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Powered by</p>
              <img
                src={kadoshLogo}
                alt="Kadosh AI"
                className="h-8 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
              />
            </div>

            {/* Copyright */}
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} SlideSmith AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}