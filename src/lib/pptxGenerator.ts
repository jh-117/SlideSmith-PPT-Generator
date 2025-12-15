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

    // Bullets
    s.addText(slide.bullets.map(b => ({ text: b, options: { breakLine: true } })), {
      x: 0.5, y: 1.8, w: 5, h: 3,
      fontSize: 18,
      fontFace: "Arial",
      color: "E2E8F0",
      bullet: true,
      align: "left",
      valign: "top"
    });

    // Image
    if (slide.imageUrl) {
      s.addImage({
        path: slide.imageUrl,
        x: 6, y: 1.8, w: 3.5, h: 3,
        sizing: { type: "cover", w: 3.5, h: 3 }
      });
    }

    // Notes
    if (slide.notes) {
      s.addNotes(slide.notes);
    }
  });

  // Save
  await pptx.writeFile({ fileName: `SlideSmith - ${deck.topic}.pptx` });
};
