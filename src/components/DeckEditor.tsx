import { useState, useEffect } from "react";
import { Deck, Slide } from "../lib/types";
import { SlidePreview } from "./SlidePreview";
import { SlideEditorPanel } from "./SlideEditorPanel";
import { Button } from "./ui/button";
import { Download, ChevronLeft, Save, History, Clock, Menu, Edit, Sidebar } from "lucide-react";
import { cn } from "../lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

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
  onBack
}: DeckEditorProps) {
  const [activeSlideId, setActiveSlideId] = useState<string>("");
  const [isSlidesSheetOpen, setIsSlidesSheetOpen] = useState(false);
  const [isEditorSheetOpen, setIsEditorSheetOpen] = useState(false);

  useEffect(() => {
    if (deck && deck.slides.length > 0) {
      const currentIndex = deck.slides.findIndex(s => s.id === activeSlideId);
      if (currentIndex === -1) {
        setActiveSlideId(deck.slides[0].id);
      }
    }
  }, [deck, activeSlideId]);

  const activeSlideIndex = deck.slides.findIndex(s => s.id === activeSlideId);
  const activeSlide = deck.slides[activeSlideIndex] || deck.slides[0];

  const handleUpdateSlide = (updatedSlide: Slide) => {
    const newSlides = [...deck.slides];
    const idx = newSlides.findIndex(s => s.id === updatedSlide.id);
    if (idx !== -1) {
      newSlides[idx] = updatedSlide;
      onUpdateDeck({ ...deck, slides: newSlides });
    }
  };

  const SlideThumbnails = () => (
    <div className="space-y-4">
      {deck.slides.map((slide, index) => (
        <div
          key={slide.id}
          onClick={() => {
            setActiveSlideId(slide.id);
            setIsSlidesSheetOpen(false);
          }}
          className={cn(
            "group relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200",
            (activeSlideId === slide.id || (!activeSlideId && index === 0))
              ? "border-blue-500 ring-4 ring-blue-500/10 scale-[1.02]"
              : "border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100"
          )}
        >
          <div className="pointer-events-none origin-top-left transform scale-[0.22]" style={{ width: '960px', height: '540px', marginBottom: '-421px' }}>
            <SlidePreview slide={slide} />
          </div>

          <div className={cn(
            "absolute bottom-2 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur transition-colors",
            (activeSlideId === slide.id || (!activeSlideId && index === 0))
              ? "bg-blue-600 text-white"
              : "bg-black/60 text-slate-300"
          )}>
            {index + 1}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-[#0f111a] text-white overflow-hidden">
      <header className="h-14 md:h-16 border-b border-slate-800 flex items-center justify-between px-3 md:px-6 bg-slate-900/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-2 md:gap-6 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-slate-400 hover:text-white hover:bg-slate-800 px-2 md:px-3"
          >
            <ChevronLeft className="h-4 w-4 md:mr-1" />
            <span className="hidden md:inline">Start Over</span>
          </Button>

          <div className="h-8 w-px bg-slate-800 hidden md:block" />

          <div className="min-w-0 flex-1">
            <h1 className="font-semibold text-sm md:text-base text-slate-100 truncate">
              {deck.topic}
            </h1>
            <p className="text-xs text-slate-500 hidden sm:flex items-center gap-1">
              <Clock className="w-3 h-3" /> Last edited {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden md:flex items-center gap-2 mr-2 md:mr-4 bg-slate-950 rounded-md p-1 border border-slate-800">
             <History className="w-4 h-4 ml-2 text-slate-500" />
             <Select value={deck.id} onValueChange={onSwitchVersion}>
              <SelectTrigger className="w-[100px] md:w-[140px] h-8 text-xs border-none bg-transparent focus:ring-0">
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
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-blue-500/20 border-0 h-8 md:h-9 text-xs md:text-sm px-3 md:px-4"
          >
            <Download className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
            <span className="hidden md:inline">Export PPTX</span>
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sheet open={isSlidesSheetOpen} onOpenChange={setIsSlidesSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-2 top-20 z-30 lg:hidden bg-slate-900 hover:bg-slate-800 text-white border border-slate-700"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-[#0a0c10] border-slate-800 p-0">
            <div className="p-4 border-b border-slate-800/50">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Slide Deck</h3>
            </div>
            <div className="px-4 pb-4 pt-4 overflow-y-auto h-[calc(100vh-80px)]">
              <SlideThumbnails />
            </div>
          </SheetContent>
        </Sheet>

        <div className="hidden lg:flex w-72 bg-[#0a0c10] border-r border-slate-800 flex-col overflow-y-auto custom-scrollbar">
          <div className="p-4 sticky top-0 bg-[#0a0c10] z-10 border-b border-slate-800/50 mb-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Slide Deck</h3>
          </div>
          <div className="px-4 pb-4">
            <SlideThumbnails />
          </div>
        </div>

        <div className="flex-1 bg-[#161922] relative flex flex-col items-center justify-center p-3 md:p-8 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />

          {activeSlide && (
            <div className="relative z-10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.7)] w-full h-full flex items-center justify-center">
               <SlidePreview slide={activeSlide} scale={0.85} responsive />
            </div>
          )}
        </div>

        <Sheet open={isEditorSheetOpen} onOpenChange={setIsEditorSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-20 z-30 xl:hidden bg-slate-900 hover:bg-slate-800 text-white border border-slate-700"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 bg-slate-900 border-slate-800 p-0">
            {activeSlide && (
              <SlideEditorPanel slide={activeSlide} onUpdate={handleUpdateSlide} />
            )}
          </SheetContent>
        </Sheet>

        {activeSlide && (
          <div className="hidden xl:block">
            <SlideEditorPanel slide={activeSlide} onUpdate={handleUpdateSlide} />
          </div>
        )}
      </div>
    </div>
  );
}
