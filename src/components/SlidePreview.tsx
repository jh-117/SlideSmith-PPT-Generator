import { Slide } from "../lib/types";
import { cn } from "../lib/utils";

interface SlidePreviewProps {
  slide: Slide;
  scale?: number;
  isActive?: boolean;
  onClick?: () => void;
}

export function SlidePreview({ slide, scale = 1, isActive, onClick }: SlidePreviewProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative bg-[#0F111A] overflow-hidden shadow-lg transition-all duration-200 origin-top-left",
        isActive ? "ring-2 ring-blue-500 shadow-blue-500/20" : "hover:ring-1 hover:ring-slate-600",
        onClick ? "cursor-pointer" : ""
      )}
      style={{
        width: "960px",
        height: "540px",
        transform: `scale(${scale})`,
        marginBottom: `-${(1 - scale) * 540}px`,
        marginRight: `-${(1 - scale) * 960}px`
      }}
    >
      {/* Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-blue-400" />

      <div className="px-12 py-8 h-full flex flex-col pt-14">
        {/* Title */}
        <h2 className="text-4xl font-bold text-white mb-6 leading-tight break-words">
          {slide.title}
        </h2>

        <div className="flex gap-8 flex-1 min-h-0">
          {/* Bullets - Left Column */}
          <div className="flex-1 pr-4 overflow-hidden">
            <ul className="space-y-4">
              {slide.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start text-lg text-slate-200 leading-relaxed">
                  <span className="mr-3 text-blue-400 flex-shrink-0 mt-1">•</span>
                  <span className="break-words">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Visual - Right Column */}
          <div className="w-80 flex-shrink-0 flex items-center pb-8">
            <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-slate-800 border border-slate-700 relative">
              {slide.imageUrl ? (
                <img
                  src={slide.imageUrl}
                  alt={slide.imageKeyword}
                  className="w-full h-full object-cover opacity-80"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500 text-sm">
                  Visual Placeholder
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 right-6 text-slate-600 text-sm">
        SlideSmith Generated
      </div>
    </div>
  );
}
