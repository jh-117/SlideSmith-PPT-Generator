import { useState } from 'react';
import { Button } from './ui/button';
import { X, HelpCircle, Keyboard, MousePointer2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HelpItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const HELP_ITEMS: HelpItem[] = [
  {
    icon: <MousePointer2 className="w-5 h-5" />,
    title: 'Select Slides',
    description: 'Click on any slide thumbnail in the left panel to edit it.',
  },
  {
    icon: <Keyboard className="w-5 h-5" />,
    title: 'Edit Text',
    description: 'Click on slide title or bullet points in the right panel to edit them directly.',
  },
  {
    icon: '🎨',
    title: 'Change Images',
    description: 'Use the "Change Image" button to search and replace slide images from Unsplash.',
  },
  {
    icon: '✨',
    title: 'AI Regenerate',
    description: 'Click "Regenerate with AI" to improve slide content automatically.',
  },
  {
    icon: '💾',
    title: 'Save Versions',
    description: 'Click the save icon in the header to create a new version before major changes.',
  },
  {
    icon: '⏮',
    title: 'Switch Versions',
    description: 'Use the version dropdown to switch between different saved versions.',
  },
  {
    icon: '📥',
    title: 'Export',
    description: 'Click "Export PPTX" to download your presentation as a PowerPoint file.',
  },
  {
    icon: '💡',
    title: 'Speaker Notes',
    description: 'Each slide has speaker notes at the bottom that will be included in your export.',
  },
];

interface EditorHelpPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditorHelpPanel({ isOpen, onClose }: EditorHelpPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-slate-900 border-l border-slate-800 z-50 flex flex-col"
          >
            <div className="flex-shrink-0 p-6 border-b border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Editor Guide</h2>
                    <p className="text-sm text-slate-400">Quick tips to get you started</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {HELP_ITEMS.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-colors"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 mb-6">
                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <span>💡</span>
                  Pro Tip
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  All your changes are automatically saved. You can close your browser and come back anytime to continue editing your presentations.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
