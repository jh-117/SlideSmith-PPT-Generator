import PptxGenJS from "pptxgenjs";
import { Deck } from "./types";

export const exportDeck = async (deck: Deck) => {
  const pptx = new PptxGenJS();

  // Set Layout
  pptx.layout = "LAYOUT_16x9";

  // Set Meta
  pptx.title = deck.topic;
  pptx.subject = `Presentation for ${deck.audience}`;

  // Define Master Slide (Dark Theme)
  pptx.defineSlideMaster({
    title: "MASTER_DARK",
    background: { color: "0F111A" },
    objects: [
      {
        rect: { x: 0, y: 0, w: "100%", h: 0.15, fill: { color: "38BDF8" } } // Top accent bar
      }
    ]
  });

  // Generate Slides
  deck.slides.forEach((slide) => {
    const s = pptx.addSlide({ masterName: "MASTER_DARK" });

    // Title
    s.addText(slide.title, {
      x: 0.5, y: 0.5, w: "90%", h: 1,
      fontSize: 32,
      fontFace: "Arial",
      color: "FFFFFF",
      bold: true,
      align: "left"
    });

    // Bullets - each bullet as a separate paragraph with proper spacing
    const bulletTextProps = slide.bullets.map(b => ({
      text: b,
      options: {
        bullet: { type: "bullet" as const },
        breakLine: true, // Force new line for each bullet
        paraSpaceAfter: 8,  // Space after each paragraph (in points)
        paraSpaceBefore: 0,
      }
    }));

    s.addText(bulletTextProps, {
      x: 0.5, y: 1.8, w: 5, h: 3,
      fontSize: 18,
      fontFace: "Arial",
      color: "E2E8F0",
      align: "left",
      valign: "top",
      lineSpacingMultiple: 1.5,  // 1.5x line spacing within each bullet
    });

    // Image
    if (slide.imageUrl) {
      s.addImage({
        path: slide.imageUrl,
        x: 6, y: 1.8, w: 3.5, h: 3,
        sizing: { type: "cover", w: 3.5, h: 3 }
      });

      // Attribution
      if (slide.imageAttribution) {
        s.addText(
          `Photo by ${slide.imageAttribution.photographerName} on Unsplash`,
          {
            x: 6, y: 4.85, w: 3.5, h: 0.2,
            fontSize: 8,
            fontFace: "Arial",
            color: "94A3B8",
            align: "right",
            italic: true
          }
        );
      }
    }

    // Notes
    if (slide.notes) {
      s.addNotes(slide.notes);
    }
  });

  // Save
  await pptx.writeFile({ fileName: `SlideSmith - ${deck.topic}.pptx` });
};
