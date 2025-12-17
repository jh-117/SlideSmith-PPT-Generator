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
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(imageKeyword)}&per_page=1&orientation=landscape`,
        {
          headers: {
            Authorization: `Client-ID fZGZ5q-hGH9_PGU3k7vVeJd3NMQIiJXz_fOGH-_bZRw`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const image = data.results[0];
        const photographerUrl = `${image.user.links.html}?utm_source=slidesmith&utm_medium=referral`;
        const unsplashUrl = `${image.links.html}?utm_source=slidesmith&utm_medium=referral`;

        onUpdate({
          ...slide,
          imageKeyword,
          imageUrl: image.urls.regular,
          imageAttribution: {
            photographerName: image.user.name,
            photographerUrl: photographerUrl,
            unsplashUrl: unsplashUrl,
          },
        });
        toast.success("Image updated successfully");
      } else {
        toast.error("No images found for this keyword");
      }
    } catch (error) {
      console.error("Error fetching image:", error);
      toast.error("Failed to fetch image");
    } finally {
      setIsLoadingImage(false);
    }
  };

  return (
    <div className="w-80 bg-slate-900 border-l border-slate-800 p-6 flex flex-col gap-6 overflow-y-auto h-full">
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
      </div>
    </div>
  );
}
