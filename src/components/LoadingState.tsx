import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Progress } from "./ui/progress";

const STEPS = [
  "Analyzing brief...",
  "Structuring executive narrative...",
  "Drafting slide content...",
  "Selecting high-impact visuals...",
  "Polishing final layout..."
];

export function LoadingState() {
  const [stepIndex, setStepIndex] = useState(0);
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f111a] text-white">
      <div className="relative w-32 h-32 mb-8">
        <motion.div
          className="absolute inset-0 border-4 border-blue-500/30 rounded-full"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-2 border-4 border-indigo-500/50 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{ borderTopColor: "transparent", borderLeftColor: "transparent" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
           <div className="w-16 h-16 bg-blue-500/20 blur-xl rounded-full animate-pulse" />
        </div>
      </div>
      
      <motion.h2
        key={stepIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="text-2xl font-light tracking-wide text-blue-200 mb-8"
      >
        {STEPS[stepIndex]}
      </motion.h2>

      <div className="w-full max-w-md px-4 space-y-3">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-sm text-slate-400">
          <span>Step {stepIndex + 1} of {STEPS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
}
