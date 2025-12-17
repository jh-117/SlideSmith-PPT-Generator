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
      {/* Slide Content mimicking the PPTX Master */}
      
      {/* Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-blue-400" />

      <div className="p-12 h-full flex flex-col pt-16">
        {/* Title */}
        <h2 className="text-4xl font-bold text-white mb-8 leading-tight">
          {slide.title}
        </h2>

        <div className="flex gap-8 flex-1">
          {/* Bullets - Left Column */}
          <div className="flex-1 pr-4">
            <ul className="space-y-6">
              {slide.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start text-xl text-slate-200">
                  <span className="mr-3 text-blue-400 mt-1">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Visual - Right Column */}
          <div className="w-1/3 h-full pb-8">
            <div className="w-full h-full rounded-lg overflow-hidden bg-slate-800 border border-slate-700 relative">
              {slide.imageUrl ? (
                <>
                  <img
                    src={slide.imageUrl}
                    alt={slide.imageKeyword}
                    className="w-full h-full object-cover opacity-80"
                  />
                  {slide.imageAttribution && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1 text-[10px] text-white/80">
                      Photo by{' '}
                      <a
                        href={slide.imageAttribution.photographerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-white"
                      >
                        {slide.imageAttribution.photographerName}
                      </a>
                      {' '}on{' '}
                      <a
                        href={slide.imageAttribution.unsplashUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-white"
                      >
                        Unsplash
                      </a>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                  Visual Placeholder
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer/Number (Mock) */}
      <div className="absolute bottom-4 right-6 text-slate-600 text-sm">
        SlideSmith Generated
      </div>
    </div>
  );
}
