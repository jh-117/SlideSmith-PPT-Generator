import { Slide } from "../lib/types";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { RefreshCw, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface SlideEditorPanelProps {
  slide: Slide;
  onUpdate: (updatedSlide: Slide) => void;
}

export function SlideEditorPanel({ slide, onUpdate }: SlideEditorPanelProps) {

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...slide, title: e.target.value });
  };

  const handleBulletsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const bullets = e.target.value.split('\n').filter(line => line.trim() !== '');
    onUpdate({ ...slide, bullets });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ ...slide, notes: e.target.value });
  };

  const handleRegenImage = () => {
    // In a real app, this would call Unsplash API again.
    // Here we mock by just appending a random query param to force refresh if it was a random url, 
    // but since we use fixed urls, we can't easily change it without a pool.
    // We'll just show a toast or console log for MVP.
    console.log("Regenerate image requested");
  };

  return (
    <div className="hidden lg:flex w-64 xl:w-80 bg-slate-900 border-l border-slate-800 p-4 xl:p-6 flex-col gap-4 xl:gap-6 overflow-y-auto h-full">
      <div>
        <h3 className="text-lg font-semibold text-white mb-1">Edit Slide</h3>
        <p className="text-xs text-slate-500">Customize content and visuals</p>
      </div>

      <div className="space-y-3">
        <Label htmlFor="slide-title">Title</Label>
        <Input
          id="slide-title"
          value={slide.title}
          onChange={handleTitleChange}
          className="bg-slate-950 border-slate-700"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="slide-bullets">Bullet Points (one per line)</Label>
        <Textarea
          id="slide-bullets"
          value={slide.bullets.join('\n')}
          onChange={handleBulletsChange}
          className="min-h-[120px] xl:min-h-[150px] bg-slate-950 border-slate-700 font-mono text-sm"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="slide-notes">Speaker Notes</Label>
        <Textarea
          id="slide-notes"
          value={slide.notes}
          onChange={handleNotesChange}
          className="min-h-[80px] xl:min-h-[100px] bg-slate-950 border-slate-700 text-slate-400 italic"
        />
      </div>

      <div className="pt-4 border-t border-slate-800 space-y-2">
        <Label>Actions</Label>
        <Button
          variant="outline"
          className="w-full justify-start text-slate-400 hover:text-white border-slate-700 hover:bg-slate-800"
          onClick={() => toast.info("Image regeneration is a mock feature")}
        >
          <ImageIcon className="mr-2 h-4 w-4" /> Change Visual
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start text-slate-400 hover:text-white border-slate-700 hover:bg-slate-800"
          onClick={() => toast.info("Text regeneration is a mock feature")}
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Regenerate Text
        </Button>
      </div>
    </div>
  );
}
