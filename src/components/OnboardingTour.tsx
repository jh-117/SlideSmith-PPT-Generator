import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { X, ArrowRight, ArrowLeft, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TourStep {
  title: string;
  description: string;
  highlight?: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: 'Welcome to SlideSmith',
    description: 'Create professional presentation decks in minutes using AI. Let me show you how it works.',
  },
  {
    title: 'Step 1: Fill Your Brief',
    description: 'Tell us about your presentation topic, audience, and objectives. The more detail you provide, the better your deck will be.',
  },
  {
    title: 'Step 2: AI Generates Your Deck',
    description: 'Our AI analyzes your brief and creates a complete 5-slide presentation with titles, content, speaker notes, and relevant images.',
  },
  {
    title: 'Step 3: Edit & Customize',
    description: 'Fine-tune your slides with our editor. Change text, swap images, regenerate content with AI, or manually edit anything you want.',
  },
  {
    title: 'Step 4: Export & Present',
    description: 'Download your presentation as a PowerPoint file (.pptx) ready to present. All your work is automatically saved.',
  },
];

interface OnboardingTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function OnboardingTour({ onComplete, onSkip }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(onComplete, 300);
  };

  const handleSkipClick = () => {
    setIsVisible(false);
    setTimeout(onSkip, 300);
  };

  const step = TOUR_STEPS[currentStep];

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
            onClick={handleSkipClick}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
          >
            <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-8 mx-4">
              <button
                onClick={handleSkipClick}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                  <p className="text-sm text-slate-400">
                    Step {currentStep + 1} of {TOUR_STEPS.length}
                  </p>
                </div>
              </div>

              <p className="text-slate-300 text-lg leading-relaxed mb-8">{step.description}</p>

              <div className="flex items-center gap-3">
                <div className="flex gap-1.5 flex-1">
                  {TOUR_STEPS.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 rounded-full transition-all ${
                        index === currentStep
                          ? 'bg-blue-500 flex-1'
                          : index < currentStep
                          ? 'bg-blue-500/50 w-8'
                          : 'bg-slate-700 w-8'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 gap-3">
                <Button
                  variant="ghost"
                  onClick={handleSkipClick}
                  className="text-slate-400 hover:text-white"
                >
                  Skip Tour
                </Button>
                <div className="flex gap-2">
                  {currentStep > 0 && (
                    <Button variant="outline" onClick={handleBack}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                  )}
                  <Button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
                  >
                    {currentStep < TOUR_STEPS.length - 1 ? (
                      <>
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      "Get Started"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
