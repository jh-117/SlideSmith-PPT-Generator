import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Label } from "./ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Progress } from "./ui/progress";
import { Brief } from "../lib/types";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Loader2, Sparkles, Wand2, Check, Info } from "lucide-react";
import { cn } from "../lib/utils";

interface BriefFormEnhancedProps {
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

const FIELD_TOOLTIPS = {
  topic: "The main subject or title of your presentation. Be specific and concise.",
  audience: "Who will be viewing or listening to this presentation? Understanding your audience helps tailor the content.",
  objective: "What do you want to achieve? What decision or action should follow this presentation?",
  situation: "Provide context about the current state, problem, or opportunity you're addressing.",
  insights: "Share key data points, research findings, or compelling evidence that supports your objective."
};

export function BriefFormEnhanced({ onBack, onSubmit, isLoading, initialBrief }: BriefFormEnhancedProps) {
  const [brief, setBrief] = useState<Brief>(initialBrief || {
    topic: "",
    audience: "",
    objective: "",
    situation: "",
    insights: ""
  });

  const [focusedField, setFocusedField] = useState<keyof Brief | null>(null);

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

  const isFieldComplete = (field: keyof Brief): boolean => {
    return brief[field].trim().length > 0;
  };

  const requiredFields: (keyof Brief)[] = ['topic', 'audience', 'objective', 'situation'];
  const completedFields = requiredFields.filter(isFieldComplete).length;
  const progressPercent = (completedFields / requiredFields.length) * 100;
  const isFormValid = requiredFields.every(isFieldComplete);

  const renderSuggestions = (field: keyof Brief) => {
    if (focusedField !== field) return null;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex flex-wrap gap-2 mt-2"
        >
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
        </motion.div>
      </AnimatePresence>
    );
  };

  const FieldLabel = ({ field, label }: { field: keyof Brief; label: string }) => (
    <div className="flex items-center gap-2">
      <Label htmlFor={field} className="flex items-center gap-2">
        {label}
        {isFieldComplete(field) && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center"
          >
            <Check className="w-3 h-3 text-white" />
          </motion.div>
        )}
      </Label>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="w-4 h-4 text-slate-500 cursor-help" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs bg-slate-800 text-slate-100 border-slate-700">
            <p className="text-sm">{FIELD_TOOLTIPS[field]}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
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
          className="text-blue-400 border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-300"
        >
          <Wand2 className="mr-2 h-4 w-4" /> Autofill Example
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Project Brief</h2>
          <p className="text-slate-400">Tell us about your presentation needs. Fill out all required fields to continue.</p>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Progress: {completedFields} of {requiredFields.length} required fields</span>
              <span className="text-blue-400 font-medium">{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-blue-400">Core Context</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <FieldLabel field="topic" label="Topic / Title" />
                  <Input
                    id="topic"
                    name="topic"
                    placeholder="e.g. Q3 Marketing Strategy"
                    value={brief.topic}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('topic')}
                    onBlur={() => setTimeout(() => setFocusedField(null), 200)}
                    required
                    className={cn(
                      "bg-slate-950/50 border-slate-700 focus:border-blue-500",
                      isFieldComplete('topic') && "border-green-500/50"
                    )}
                  />
                  {renderSuggestions('topic')}
                </div>
                <div className="space-y-2">
                  <FieldLabel field="audience" label="Target Audience" />
                  <Input
                    id="audience"
                    name="audience"
                    placeholder="e.g. Board of Directors"
                    value={brief.audience}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('audience')}
                    onBlur={() => setTimeout(() => setFocusedField(null), 200)}
                    required
                    className={cn(
                      "bg-slate-950/50 border-slate-700 focus:border-blue-500",
                      isFieldComplete('audience') && "border-green-500/50"
                    )}
                  />
                  {renderSuggestions('audience')}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <FieldLabel field="objective" label="Objective / Decision Needed" />
                <Textarea
                  id="objective"
                  name="objective"
                  placeholder="What is the goal? e.g. Approve $50k budget for new tools."
                  value={brief.objective}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('objective')}
                  onBlur={() => setTimeout(() => setFocusedField(null), 200)}
                  required
                  className={cn(
                    "bg-slate-950/50 border-slate-700 focus:border-blue-500 min-h-[80px]",
                    isFieldComplete('objective') && "border-green-500/50"
                  )}
                />
                {renderSuggestions('objective')}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-blue-400">Narrative Details</CardTitle>
              <CardDescription>Give the AI some meat to work with.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <FieldLabel field="situation" label="Current Situation / Problem" />
                <Textarea
                  id="situation"
                  name="situation"
                  placeholder="Why are we here? e.g. Conversion rates dropped 15% last quarter."
                  value={brief.situation}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('situation')}
                  onBlur={() => setTimeout(() => setFocusedField(null), 200)}
                  required
                  className={cn(
                    "bg-slate-950/50 border-slate-700 focus:border-blue-500 min-h-[100px]",
                    isFieldComplete('situation') && "border-green-500/50"
                  )}
                />
                {renderSuggestions('situation')}
              </div>
              <div className="space-y-2">
                <FieldLabel field="insights" label="Key Insights / Evidence (Optional)" />
                <Textarea
                  id="insights"
                  name="insights"
                  placeholder="Any data points or key arguments to include?"
                  value={brief.insights}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('insights')}
                  onBlur={() => setTimeout(() => setFocusedField(null), 200)}
                  className={cn(
                    "bg-slate-950/50 border-slate-700 focus:border-blue-500 min-h-[100px]",
                    isFieldComplete('insights') && "border-green-500/50"
                  )}
                />
                {renderSuggestions('insights')}
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={isLoading || !isFormValid}
            size="lg"
            className={cn(
              "w-full font-bold py-6 text-lg transition-all",
              isFormValid
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating Deck...
              </>
            ) : !isFormValid ? (
              <>
                Complete Required Fields First
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
