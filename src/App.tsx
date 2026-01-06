import { useState, useEffect } from "react";
import { Hero } from "./components/Hero";
import { BriefFormImproved } from "./components/BriefFormImproved";
import { LoadingState } from "./components/LoadingState";
import { DeckEditor } from "./components/DeckEditor";
import { Dashboard } from "./components/Dashboard";
import { ExampleGallery } from "./components/ExampleGallery";
import { OnboardingTour } from "./components/OnboardingTour";
import PrivacyPolicy from "./components/PrivacyPolicy";
import { Brief, Deck } from "./lib/types";
import { generateDeck } from "./lib/openai";
import { exportDeck } from "./lib/pptxGenerator";
import { savePresentation, loadPresentation, saveNewVersion, updatePresentation } from "./lib/database";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

type Step = "dashboard" | "landing" | "brief" | "generating" | "editor" | "privacy-policy" | "examples";

export default function App() {
  const [step, setStep] = useState<Step>("dashboard");
  const [previousStep, setPreviousStep] = useState<Step>("dashboard");
  const [brief, setBrief] = useState<Brief | null>(null);
  const [versions, setVersions] = useState<Deck[]>([]);
  const [currentDeckId, setCurrentDeckId] = useState<string | null>(null);
  const [currentPresentationId, setCurrentPresentationId] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

  const currentDeck = versions.find(d => d.id === currentDeckId) || null;

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('slidesmith_onboarding_completed');
    if (!hasSeenOnboarding && step === "landing") {
      setShowOnboarding(true);
    }
  }, [step]);

  const handleOnboardingComplete = () => {
    localStorage.setItem('slidesmith_onboarding_completed', 'true');
    setShowOnboarding(false);
  };

  const handleOnboardingSkip = () => {
    localStorage.setItem('slidesmith_onboarding_completed', 'true');
    setShowOnboarding(false);
  };

  const handleStart = () => {
    setStep("brief");
    setCurrentPresentationId(null);
    setBrief(null);
  };

  const handleCreateNew = () => {
    setStep("landing");
    setCurrentPresentationId(null);
    setBrief(null);
    setVersions([]);
    setCurrentDeckId(null);
  };

  const handleOpenPresentation = async (presentationId: string) => {
    try {
      toast.loading('Loading presentation...');
      const { brief: loadedBrief, deck, versions: loadedVersions } = await loadPresentation(presentationId);

      setBrief(loadedBrief);
      setVersions(loadedVersions);
      setCurrentDeckId(deck.id);
      setCurrentPresentationId(presentationId);
      setStep("editor");

      toast.dismiss();
      toast.success('Presentation loaded');
    } catch (error) {
      console.error("Failed to load presentation", error);
      toast.dismiss();
      toast.error("Failed to load presentation");
    }
  };

  const handlePrivacyPolicyClick = () => {
    setPreviousStep(step);
    setStep("privacy-policy");
  };

  const handlePrivacyPolicyBack = () => {
    setStep(previousStep);
  };

  const handleHomeClick = () => {
    setStep("dashboard");
  };

  const handleShowExamples = () => {
    setStep("examples");
  };

  const handleSelectExample = (exampleBrief: Brief) => {
    setBrief(exampleBrief);
    setStep("brief");
  };

  const handleBriefSubmit = async (submittedBrief: Brief) => {
    setBrief(submittedBrief);
    setStep("generating");

    try {
      const generatedDeck = await generateDeck(submittedBrief);
      setVersions([generatedDeck]);
      setCurrentDeckId(generatedDeck.id);

      const presentationId = await savePresentation(submittedBrief, generatedDeck);
      setCurrentPresentationId(presentationId);

      setStep("editor");
      toast.success("Presentation created successfully!");
    } catch (error) {
      console.error("Failed to generate deck", error);
      toast.error("Failed to generate deck. Please try again.");
      setStep("brief");
    }
  };

  const handleUpdateDeck = async (updatedDeck: Deck) => {
    setVersions(prev => prev.map(d => d.id === updatedDeck.id ? updatedDeck : d));

    if (currentPresentationId && brief) {
      try {
        await updatePresentation(currentPresentationId, brief);
      } catch (error) {
        console.error("Auto-save failed", error);
      }
    }
  };

  const handleSaveVersion = async () => {
    if (!currentDeck || !currentPresentationId) return;

    try {
      const newVersion: Deck = {
        ...currentDeck,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        slides: currentDeck.slides.map(s => ({ ...s, bullets: [...s.bullets] }))
      };

      setVersions(prev => [...prev, newVersion]);
      setCurrentDeckId(newVersion.id);

      await saveNewVersion(currentPresentationId, newVersion);
      toast.success("New version saved!");
    } catch (error) {
      console.error("Failed to save version", error);
      toast.error("Failed to save version");
    }
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

  if (step === "dashboard") {
    return (
      <>
        <Dashboard
          onCreateNew={handleCreateNew}
          onOpenPresentation={handleOpenPresentation}
          onPrivacyPolicyClick={handlePrivacyPolicyClick}
        />
        <Toaster position="bottom-right" theme="dark" />
      </>
    );
  }

  if (step === "examples") {
    return (
      <>
        <ExampleGallery
          onSelectExample={handleSelectExample}
          onClose={() => setStep("landing")}
        />
        <Toaster position="bottom-right" theme="dark" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-blue-500/30">
      {showOnboarding && (
        <OnboardingTour
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}

      {step === "landing" && (
        <Hero
          onStart={handleStart}
          onPrivacyPolicyClick={handlePrivacyPolicyClick}
          onShowExamples={handleShowExamples}
        />
      )}

      {step === "brief" && (
        <BriefFormImproved
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
            if (confirm("Return to dashboard? Your work is auto-saved.")) {
              setStep("dashboard");
            }
          }}
        />
      )}

      <Toaster position="bottom-right" theme="dark" />
    </div>
  );
}
