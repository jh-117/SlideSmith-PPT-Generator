import { Slide } from "../lib/types";
import { cn } from "../lib/utils";

interface SlidePreviewProps {
  slide: Slide;
  scale?: number;
  isActive?: boolean;
  onClick?: () => void;
  responsive?: boolean;
}

export function SlidePreview({ slide, scale = 1, isActive, onClick, responsive = false }: SlidePreviewProps) {
  if (responsive) {
    return (
      <div
        onClick={onClick}
        className={cn(
          "relative bg-[#0F111A] overflow-hidden shadow-lg transition-all duration-200 w-full max-w-5xl aspect-video rounded-sm",
          isActive ? "ring-2 ring-blue-500 shadow-blue-500/20" : "hover:ring-1 hover:ring-slate-600",
          onClick ? "cursor-pointer" : ""
        )}
      >
        <div className="absolute top-0 left-0 right-0 h-[0.8%] md:h-[0.74%] bg-blue-400" />

        <div className="p-4 sm:p-6 md:p-8 lg:p-12 h-full flex flex-col pt-6 sm:pt-8 md:pt-12 lg:pt-16">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 md:mb-6 lg:mb-8 leading-tight">
            {slide.title}
          </h2>

          <div className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8 flex-1">
            <div className="flex-1 pr-0 md:pr-4">
              <ul className="space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-6">
                {slide.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start text-xs sm:text-sm md:text-base lg:text-xl text-slate-200">
                    <span className="mr-2 md:mr-3 text-blue-400 mt-0.5 md:mt-1">•</span>
                    <span className="break-words">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full md:w-1/3 h-32 sm:h-48 md:h-full pb-0 md:pb-8">
              <div className="w-full h-full rounded-lg overflow-hidden bg-slate-800 border border-slate-700 relative">
                {slide.imageUrl ? (
                  <img
                    src={slide.imageUrl}
                    alt={slide.imageKeyword}
                    className="w-full h-full object-cover opacity-80"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-500 text-xs md:text-sm">
                    Visual Placeholder
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-2 right-3 md:bottom-4 md:right-6 text-slate-600 text-[10px] md:text-sm">
          SlideSmith Generated
        </div>
      </div>
    );
  }

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
                <img 
                  src={slide.imageUrl} 
                  alt={slide.imageKeyword} 
                  className="w-full h-full object-cover opacity-80"
                />
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
