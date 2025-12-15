import { Brief, Deck, Slide } from "./types";

const MOCK_IMAGES = [
  "https://images.unsplash.com/photo-1670383050616-682df7d57b22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmclMjBzdHJhdGVneSUyMGRhcmslMjBtb2Rlcm58ZW58MXx8fHwxNzY1NzkxOTEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1744782211816-c5224434614f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwYW5hbHlzaXMlMjBjaGFydCUyMGRpZ2l0YWwlMjBzY3JlZW58ZW58MXx8fHwxNzY1NzkxOTEyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1758520144667-3041caeff3c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleGVjdXRpdmUlMjB0ZWFtJTIwcHJvZmVzc2lvbmFsJTIwZGFya3xlbnwxfHx8fDE3NjU3OTE5MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1634547487344-c3aa2e1aacdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBhcmNoaXRlY3R1cmUlMjBza3lzY3JhcGVyfGVufDF8fHx8MTc2NTc5MTkxM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1745847768380-2caeadbb3b71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHBhcnRuZXJzaGlwJTIwaGFuZHNoYWtlJTIwY2xvc2UlMjB1cHxlbnwxfHx8fDE3NjU3OTE5MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
];

export const generateDeck = async (brief: Brief): Promise<Deck> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: crypto.randomUUID(),
        topic: brief.topic,
        audience: brief.audience,
        createdAt: new Date().toISOString(),
        slides: [
          {
            id: crypto.randomUUID(),
            title: `Executive Summary: ${brief.topic}`,
            bullets: [
              `Strategic alignment with ${brief.audience} needs`,
              "Comprehensive overview of market position",
              `Key driver: ${brief.situation}`,
              "Immediate action items and roadmap"
            ],
            notes: "Opening slide to set the stage. Emphasize the urgency of the situation and the clear path forward.",
            imageKeyword: "strategy",
            imageUrl: MOCK_IMAGES[0]
          },
          {
            id: crypto.randomUUID(),
            title: "Current Market Situation",
            bullets: [
              brief.situation,
              "Identified gaps in current operational workflow",
              "Competitor analysis reveals opportunity window",
              "Data trends indicate upward trajectory if addressed"
            ],
            notes: "Focus on the 'why now'. Use the provided situation details to ground the problem in reality.",
            imageKeyword: "data",
            imageUrl: MOCK_IMAGES[1]
          },
          {
            id: crypto.randomUUID(),
            title: "Key Insights & Analysis",
            bullets: [
              brief.insights || "Core operational inefficiencies identified",
              "Customer feedback points to specific pain points",
              "Resource allocation requires optimization",
              "Technology leverage is currently underutilized"
            ],
            notes: "Highlight the 2-3 major findings. Don't overwhelm, just hit the heavy hitters.",
            imageKeyword: "analysis",
            imageUrl: MOCK_IMAGES[2]
          },
          {
            id: crypto.randomUUID(),
            title: "Strategic Recommendations",
            bullets: [
              `Primary Objective: ${brief.objective}`,
              "Phase 1: Immediate stabilization and quick wins",
              "Phase 2: Scalable growth and integration",
              "Required investment vs. projected ROI"
            ],
            notes: "The solution slide. Connect the objective directly to the insights from the previous slide.",
            imageKeyword: "office",
            imageUrl: MOCK_IMAGES[3]
          },
          {
            id: crypto.randomUUID(),
            title: "Next Steps & Timeline",
            bullets: [
              "Q1: Stakeholder alignment and kickoff",
              "Q2: Pilot program implementation",
              "Q3: Full rollout and feedback loop",
              "Decision required: Approval of initial budget"
            ],
            notes: "Closing slide. Ask for the decision. Be clear on what happens Monday morning.",
            imageKeyword: "handshake",
            imageUrl: MOCK_IMAGES[4]
          }
        ]
      });
    }, 2500); // Simulate network delay
  });
};
