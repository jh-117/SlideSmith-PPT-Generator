import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Label } from "./ui/label";
import { Brief } from "../lib/types";
import { motion } from "motion/react";
import { ArrowLeft, Loader2, Sparkles, Wand2 } from "lucide-react";

interface BriefFormProps {
  onBack: () => void;
  onSubmit: (brief: Brief) => void;
  isLoading: boolean;
  initialBrief?: Brief | null;
}

const SUGGESTIONS = {
  topic: [
    "Q3 Marketing Review",
    "New Product Launch",
    "Investor Pitch Deck",
    "Team All-Hands Update",
    "Budget Proposal 2024"
  ],
  audience: [
    "Board of Directors",
    "Executive Leadership Team",
    "Marketing Department",
    "Potential Clients",
    "Engineering Team"
  ],
  objective: [
    "Secure approval for $50k budget increase.",
    "Align team on the new roadmap priorities.",
    "Showcase 20% growth to secure Series A funding.",
    "Educate the team on the new compliance policies."
  ],
  situation: [
    "Competitors just lowered their prices by 15%.",
    "We missed our Q2 targets due to supply chain issues.",
    "User engagement has dropped significantly this month.",
    "We have a unique opportunity to acquire a smaller rival."
  ],
  insights: [
    "Customer surveys show 80% demand for this feature.",
    "Market analysis predicts a 10% CAGR in this sector.",
    "Internal data suggests high churn in the first week.",
    "Our pilot program showed a 3x ROI."
  ]
};

export function BriefForm({ onBack, onSubmit, isLoading, initialBrief }: BriefFormProps) {
  const [brief, setBrief] = useState<Brief>(initialBrief || {
    topic: "",
    audience: "",
    objective: "",
    situation: "",
    insights: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBrief(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSuggestionClick = (field: keyof Brief, value: string) => {
    if (field === 'topic' || field === 'audience') {
      setBrief(prev => ({ ...prev, [field]: value }));
    } else {
      setBrief(prev => ({
        ...prev,
        [field]: prev[field] ? `${prev[field]} ${value}` : value
      }));
    }
  };

  const handleAutofill = () => {
    const randomTopicIndex = Math.floor(Math.random() * SUGGESTIONS.topic.length);
    setBrief({
      topic: SUGGESTIONS.topic[randomTopicIndex],
      audience: SUGGESTIONS.audience[randomTopicIndex % SUGGESTIONS.audience.length],
      objective: SUGGESTIONS.objective[randomTopicIndex % SUGGESTIONS.objective.length],
      situation: SUGGESTIONS.situation[randomTopicIndex % SUGGESTIONS.situation.length],
      insights: SUGGESTIONS.insights[randomTopicIndex % SUGGESTIONS.insights.length],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(brief);
  };

  const renderSuggestions = (field: keyof Brief) => (
    <div className="flex flex-wrap gap-2 mt-2">
      {SUGGESTIONS[field].map((suggestion, i) => (
        <Button
          key={i}
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleSuggestionClick(field, suggestion)}
          className="text-xs h-7 bg-slate-800/50 border-slate-700 hover:bg-slate-700 hover:text-blue-300 text-slate-400"
        >
          {suggestion.length > 40 ? suggestion.substring(0, 40) + '...' : suggestion}
        </Button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-4xl mx-auto flex flex-col justify-center">
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-slate-400 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button
          variant="outline"
          onClick={handleAutofill}
          className="text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/10 hover:text-indigo-300"
        >
          <Wand2 className="mr-2 h-4 w-4" /> Autofill Example
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Project Brief</h2>
          <p className="text-slate-400">Tell us about your presentation needs. Use the quick-picks to speed things up.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-blue-400">Core Context</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic / Title</Label>
                  <Input
                    id="topic"
                    name="topic"
                    placeholder="e.g. Q3 Marketing Strategy"
                    value={brief.topic}
                    onChange={handleChange}
                    required
                    className="bg-slate-950/50 border-slate-700 focus:border-blue-500"
                  />
                  {renderSuggestions('topic')}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="audience">Target Audience</Label>
                  <Input
                    id="audience"
                    name="audience"
                    placeholder="e.g. Board of Directors"
                    value={brief.audience}
                    onChange={handleChange}
                    required
                    className="bg-slate-950/50 border-slate-700 focus:border-blue-500"
                  />
                  {renderSuggestions('audience')}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Label htmlFor="objective">Objective / Decision Needed</Label>
                <Textarea
                  id="objective"
                  name="objective"
                  placeholder="What is the goal? e.g. Approve $50k budget for new tools."
                  value={brief.objective}
                  onChange={handleChange}
                  required
                  className="bg-slate-950/50 border-slate-700 focus:border-blue-500 min-h-[80px]"
                />
                {renderSuggestions('objective')}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-indigo-400">Narrative Details</CardTitle>
              <CardDescription>Give the AI some meat to work with.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="situation">Current Situation / Problem</Label>
                <Textarea
                  id="situation"
                  name="situation"
                  placeholder="Why are we here? e.g. Conversion rates dropped 15% last quarter."
                  value={brief.situation}
                  onChange={handleChange}
                  required
                  className="bg-slate-950/50 border-slate-700 focus:border-indigo-500 min-h-[100px]"
                />
                {renderSuggestions('situation')}
              </div>
              <div className="space-y-2">
                <Label htmlFor="insights">Key Insights / Evidence</Label>
                <Textarea
                  id="insights"
                  name="insights"
                  placeholder="Any data points or key arguments to include?"
                  value={brief.insights}
                  onChange={handleChange}
                  className="bg-slate-950/50 border-slate-700 focus:border-indigo-500 min-h-[100px]"
                />
                {renderSuggestions('insights')}
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={isLoading}
            size="lg"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-6 text-lg shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating Deck...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" /> Generate 5-Slide Deck
              </>
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
