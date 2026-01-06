import { Slide } from "../lib/types";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { RefreshCw, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface SlideEditorPanelProps {
  slide: Slide;
  onUpdate: (updatedSlide: Slide) => void;
}

export function SlideEditorPanel({ slide, onUpdate }: SlideEditorPanelProps) {
  const [imageKeyword, setImageKeyword] = useState(slide.imageKeyword);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [isRegeneratingText, setIsRegeneratingText] = useState(false);

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

  const handleFetchNewImage = async () => {
    if (!imageKeyword.trim()) {
      toast.error("Please enter an image keyword");
      return;
    }

    setIsLoadingImage(true);
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-unsplash-image`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ keyword: imageKeyword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch image");
      }

      const data = await response.json();
      onUpdate({
        ...slide,
        imageKeyword,
        imageUrl: data.imageUrl,
        imageAttribution: data.attribution,
      });
      toast.success("Image updated successfully");
    } catch (error) {
      console.error("Error fetching image:", error);
      toast.error(error instanceof Error ? error.message : "Failed to fetch image");
    } finally {
      setIsLoadingImage(false);
    }
  };

  const handleRegenerateText = async () => {
    setIsRegeneratingText(true);
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/regenerate-slide-text`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          title: slide.title,
          bullets: slide.bullets,
          notes: slide.notes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to regenerate text");
      }

      const data = await response.json();
      onUpdate({
        ...slide,
        title: data.title,
        bullets: data.bullets,
        notes: data.notes,
      });
      toast.success("Text regenerated successfully");
    } catch (error) {
      console.error("Error regenerating text:", error);
      toast.error(error instanceof Error ? error.message : "Failed to regenerate text");
    } finally {
      setIsRegeneratingText(false);
    }
  };

  return (
    <aside className="w-80 flex-shrink-0 bg-slate-900 border-l border-slate-800 flex flex-col overflow-hidden">
      <div className="p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
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
          className="min-h-[150px] bg-slate-950 border-slate-700 font-mono text-sm"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="slide-notes">Speaker Notes</Label>
        <Textarea
          id="slide-notes"
          value={slide.notes}
          onChange={handleNotesChange}
          className="min-h-[100px] bg-slate-950 border-slate-700 text-slate-400 italic"
        />
      </div>

      <div className="pt-4 border-t border-slate-800 space-y-4">
        <div className="space-y-3">
          <Label htmlFor="image-keyword">Image Keyword</Label>
          <div className="flex gap-2">
            <Input
              id="image-keyword"
              value={imageKeyword}
              onChange={(e) => setImageKeyword(e.target.value)}
              placeholder="e.g. business meeting"
              className="bg-slate-950 border-slate-700"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleFetchNewImage();
                }
              }}
            />
            <Button
              onClick={handleFetchNewImage}
              disabled={isLoadingImage}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {isLoadingImage ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-slate-500">
            Update keyword and click to fetch a matching image
          </p>
        </div>

        <div className="space-y-2">
          <Label>AI Actions</Label>
          <Button
            variant="outline"
            className="w-full justify-start text-slate-400 hover:text-white border-slate-700 hover:bg-slate-800"
            onClick={handleRegenerateText}
            disabled={isRegeneratingText}
          >
            {isRegeneratingText ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Regenerate Text with AI
          </Button>
          <p className="text-xs text-slate-500">
            AI will improve title, bullets, and speaker notes
          </p>
        </div>
      </div>
      </div>
    </aside>
  );
}
