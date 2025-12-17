import { useState } from "react";
import { Hero } from "./components/Hero";
import { BriefForm } from "./components/BriefForm";
import { LoadingState } from "./components/LoadingState";
import { DeckEditor } from "./components/DeckEditor";
import PrivacyPolicy from "./components/PrivacyPolicy";
import { Brief, Deck } from "./lib/types";
import { generateDeck } from "./lib/mockAI";
import { exportDeck } from "./lib/pptxGenerator";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

type Step = "landing" | "brief" | "generating" | "editor" | "privacy-policy";

export default function App() {
  const [step, setStep] = useState<Step>("landing");
  const [previousStep, setPreviousStep] = useState<Step>("landing");
  const [brief, setBrief] = useState<Brief | null>(null);
  const [versions, setVersions] = useState<Deck[]>([]);
  const [currentDeckId, setCurrentDeckId] = useState<string | null>(null);

  const currentDeck = versions.find(d => d.id === currentDeckId) || null;

  const handleStart = () => {
    setStep("brief");
  };

  const handlePrivacyPolicyClick = () => {
    setPreviousStep(step);
    setStep("privacy-policy");
  };

  const handlePrivacyPolicyBack = () => {
    setStep(previousStep);
  };

  const handleHomeClick = () => {
    setStep("landing");
  };

  const handleBriefSubmit = async (submittedBrief: Brief) => {
    setBrief(submittedBrief);
    setStep("generating");
    
    try {
      const generatedDeck = await generateDeck(submittedBrief);
      setVersions([generatedDeck]);
      setCurrentDeckId(generatedDeck.id);
      setStep("editor");
    } catch (error) {
      console.error("Failed to generate deck", error);
      toast.error("Failed to generate deck. Please try again.");
      setStep("brief");
    }
  };

  const handleUpdateDeck = (updatedDeck: Deck) => {
    setVersions(prev => prev.map(d => d.id === updatedDeck.id ? updatedDeck : d));
  };

  const handleSaveVersion = () => {
    if (!currentDeck) return;
    
    const newVersion: Deck = {
      ...currentDeck,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      slides: currentDeck.slides.map(s => ({ ...s, bullets: [...s.bullets] }))
    };
    
    setVersions(prev => [...prev, newVersion]);
    setCurrentDeckId(newVersion.id);
    toast.success("New version saved!");
  };

  const handleExport = async () => {
    if (!currentDeck) return;
    
    const promise = exportDeck(currentDeck);
    toast.promise(promise, {
      loading: 'Preparing PowerPoint file...',
      success: 'Deck downloaded successfully!',
      error: 'Failed to export deck.',
    });
  };

  // Show Privacy Policy
  if (step === "privacy-policy") {
    return (
      <>
        <PrivacyPolicy 
          onBack={handlePrivacyPolicyBack}
          onHomeClick={handleHomeClick}
        />
        <Toaster position="bottom-right" theme="dark" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-blue-500/30 flex flex-col">
      <div className="flex-grow">
        {step === "landing" && (
          <Hero onStart={handleStart} />
        )}

        {step === "brief" && (
          <BriefForm
            onBack={() => setStep("landing")}
            onSubmit={handleBriefSubmit}
            isLoading={false}
            initialBrief={brief}
          />
        )}

        {step === "generating" && (
          <LoadingState />
        )}

        {step === "editor" && currentDeck && (
          <DeckEditor
            deck={currentDeck}
            versions={versions}
            onSwitchVersion={setCurrentDeckId}
            onSaveVersion={handleSaveVersion}
            onUpdateDeck={handleUpdateDeck}
            onExport={handleExport}
            onBack={() => {
              toast.warning("Unsaved changes will be lost", {
                action: {
                  label: "Leave",
                  onClick: () => setStep("brief"),
                },
                cancel: {
                  label: "Stay",
                  onClick: () => { },
                },
                duration: 10000,
              });
            }}
          />
        )}
      </div>

      {/* Footer - Show on landing and brief pages only */}
      {(step === "landing" || step === "brief") && (
        <footer className="bg-[#0f111a] border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col items-center justify-center space-y-6">
              
              {/* Privacy Policy Link */}
              <div className="text-center">
                <button
                  onClick={handlePrivacyPolicyClick}
                  className="text-slate-400 hover:text-blue-400 font-medium transition-colors text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-3 py-1.5"
                >
                  Privacy Policy
                </button>
              </div>

              {/* Powered By Section */}
              <div className="flex flex-col items-center space-y-2">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Powered by</p>
                <img
                  src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=200&h=80&fit=crop&auto=format"
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
      )}

      <Toaster position="bottom-right" theme="dark" />
    </div>
  );
}