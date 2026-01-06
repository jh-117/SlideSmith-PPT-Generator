import { useState, useEffect } from "react";
import { Deck, Slide } from "../lib/types";
import { SlidePreview } from "./SlidePreview";
import { SlideEditorPanel } from "./SlideEditorPanel";
import { Button } from "./ui/button";
import {
  Download,
  ChevronLeft,
  Save,
  History,
  Clock,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { cn } from "../lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface DeckEditorProps {
  deck: Deck;
  versions: Deck[];
  onSwitchVersion: (id: string) => void;
  onSaveVersion: () => void;
  onUpdateDeck: (deck: Deck) => void;
  onExport: () => void;
  onBack: () => void;
}

export function DeckEditor({
  deck,
  versions,
  onSwitchVersion,
  onSaveVersion,
  onUpdateDeck,
  onExport,
  onBack,
}: DeckEditorProps) {
  const [activeSlideId, setActiveSlideId] = useState<string>("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Initialize / sync active slide
  useEffect(() => {
    if (!deck.slides.length) return;

    const exists = deck.slides.some((s) => s.id === activeSlideId);
    if (!exists) {
      setActiveSlideId(deck.slides[0].id);
    }
  }, [deck, activeSlideId]);

  const activeSlideIndex = deck.slides.findIndex(
    (s) => s.id === activeSlideId
  );
  const activeSlide =
    deck.slides[activeSlideIndex] ?? deck.slides[0];

  const handleUpdateSlide = (updatedSlide: Slide) => {
    const slides = deck.slides.map((s) =>
      s.id === updatedSlide.id ? updatedSlide : s
    );
    onUpdateDeck({ ...deck, slides });
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f111a] text-white overflow-hidden">
      {/* ─────────────────── TOP BAR ─────────────────── */}
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Start Over
          </Button>

          <div className="h-8 w-px bg-slate-800" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarCollapsed((v) => !v)}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
            title={isSidebarCollapsed ? "Show slide deck" : "Hide slide deck"}
          >
            {isSidebarCollapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>

          <div className="h-8 w-px bg-slate-800" />

          <div>
            <h1 className="font-semibold text-base text-slate-100">
              {deck.topic}
            </h1>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Last edited{" "}
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Version Control */}
          <div className="flex items-center gap-2 bg-slate-950 rounded-md p-1 border border-slate-800">
            <History className="w-4 h-4 ml-2 text-slate-500" />
            <Select value={deck.id} onValueChange={onSwitchVersion}>
              <SelectTrigger className="w-[140px] h-8 text-xs border-none bg-transparent focus:ring-0">
                <SelectValue placeholder="Version" />
              </SelectTrigger>
              <SelectContent>
                {versions.map((v, i) => (
                  <SelectItem key={v.id} value={v.id}>
                    Version {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              variant="ghost"
              onClick={onSaveVersion}
              className="h-8 w-8 p-0 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10"
              title="Save as new version"
            >
              <Save className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={onExport}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-blue-500/20 border-0"
          >
            <Download className="mr-2 h-4 w-4" />
            Export PPTX
          </Button>
        </div>
      </header>

      {/* ─────────────────── MAIN WORKSPACE ─────────────────── */}
      <div className="flex flex-1 overflow-hidden transition-all duration-300">

        {/* LEFT SIDEBAR */}
        <aside
          className={cn(
            "bg-[#0a0c10] border-r border-slate-800 flex-shrink-0 transition-all duration-300 ease-in-out",
            isSidebarCollapsed ? "w-0 border-r-0" : "w-72"
          )}
        >
          <div
            className={cn(
              "h-full w-72 flex flex-col transition-opacity duration-200",
              isSidebarCollapsed
                ? "opacity-0 pointer-events-none"
                : "opacity-100"
            )}
          >
            <div className="p-4 border-b border-slate-800/50 flex-shrink-0">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Slide Deck
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4 space-y-3">
              {deck.slides.map((slide, index) => (
                <div
                  key={slide.id}
                  onClick={() => setActiveSlideId(slide.id)}
                  className={cn(
                    "relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 aspect-video",
                    activeSlideId === slide.id
                      ? "border-blue-500 ring-2 ring-blue-500/20"
                      : "border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100"
                  )}
                >
                  <div className="w-full h-full overflow-hidden">
                    <div
                      className="pointer-events-none origin-top-left"
                      style={{
                        transform: 'scale(0.267)',
                        width: '960px',
                        height: '540px',
                      }}
                    >
                      <SlidePreview slide={slide} />
                    </div>
                  </div>

                  <div className={cn(
                    "absolute bottom-1.5 left-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm transition-colors",
                    activeSlideId === slide.id
                      ? "bg-blue-600 text-white"
                      : "bg-black/60 text-slate-300"
                  )}>
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* CENTER CANVAS */}
        <main className="flex-1 min-w-0 bg-[#161922] relative flex items-center justify-center p-8 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />

          {activeSlide && (
            <div className="relative z-10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.7)]">
              <SlidePreview slide={activeSlide} scale={0.85} />
            </div>
          )}
        </main>

        {/* RIGHT PANEL */}
        {activeSlide && (
          <SlideEditorPanel
            slide={activeSlide}
            onUpdate={handleUpdateSlide}
          />
        )}
      </div>
    </div>
  );
}
