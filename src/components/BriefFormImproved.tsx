import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Label } from "./ui/label";
import { Brief } from "../lib/types";
import { motion } from "motion/react";
import { ArrowLeft, Loader2, Sparkles, Wand2, HelpCircle, Lightbulb, CheckCircle2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

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

const FIELD_TIPS = {
  topic: "A clear, concise title that summarizes your presentation's main focus.",
  audience: "Who will be viewing this presentation? Knowing your audience helps tailor the content appropriately.",
  objective: "What specific action or decision do you want from your audience? Be as specific as possible.",
  situation: "Provide context: What's the current challenge, opportunity, or background that makes this presentation necessary?",
  insights: "Share relevant data, research findings, or key points that support your case. This helps the AI create more compelling content."
};

export function BriefFormImproved({ onBack, onSubmit, isLoading, initialBrief }: BriefFormProps) {
  const [brief, setBrief] = useState<Brief>(initialBrief || {
    topic: "",
    audience: "",
    objective: "",
    situation: "",
    insights: ""
  });

  const [expandedField, setExpandedField] = useState<keyof Brief | null>(null);
  const [completedFields, setCompletedFields] = useState<Set<keyof Brief>>(new Set());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const fieldName = e.target.name as keyof Brief;
    setBrief(prev => ({ ...prev, [fieldName]: e.target.value }));

    if (e.target.value.trim().length > 0 && !completedFields.has(fieldName)) {
      setCompletedFields(prev => new Set(prev).add(fieldName));
    } else if (e.target.value.trim().length === 0 && completedFields.has(fieldName)) {
      setCompletedFields(prev => {
        const newSet = new Set(prev);
        newSet.delete(fieldName);
        return newSet;
      });
    }
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
    if (!completedFields.has(field)) {
      setCompletedFields(prev => new Set(prev).add(field));
    }
  };

  const handleAutofill = () => {
    const randomTopicIndex = Math.floor(Math.random() * SUGGESTIONS.topic.length);
    const newBrief = {
      topic: SUGGESTIONS.topic[randomTopicIndex],
      audience: SUGGESTIONS.audience[randomTopicIndex % SUGGESTIONS.audience.length],
      objective: SUGGESTIONS.objective[randomTopicIndex % SUGGESTIONS.objective.length],
      situation: SUGGESTIONS.situation[randomTopicIndex % SUGGESTIONS.situation.length],
      insights: SUGGESTIONS.insights[randomTopicIndex % SUGGESTIONS.insights.length],
    };
    setBrief(newBrief);
    setCompletedFields(new Set(['topic', 'audience', 'objective', 'situation', 'insights']));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(brief);
  };

  const progress = (completedFields.size / 4) * 100;
  const isFormValid = brief.topic && brief.audience && brief.objective && brief.situation;

  const renderField = (
    field: keyof Brief,
    label: string,
    placeholder: string,
    required: boolean = true,
    isTextarea: boolean = false
  ) => {
    const isCompleted = completedFields.has(field);
    const isExpanded = expandedField === field;

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor={field} className="flex items-center gap-2">
            {label}
            {required && <span className="text-red-400">*</span>}
            {isCompleted && <CheckCircle2 className="w-4 h-4 text-green-500" />}
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="text-slate-400 hover:text-blue-400">
                  <HelpCircle className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">{FIELD_TIPS[field]}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {isTextarea ? (
          <Textarea
            id={field}
            name={field}
            placeholder={placeholder}
            value={brief[field]}
            onChange={handleChange}
            onFocus={() => setExpandedField(field)}
            onBlur={() => setExpandedField(null)}
            required={required}
            className="bg-slate-950/50 border-slate-700 focus:border-blue-500 transition-all min-h-[100px]"
          />
        ) : (
          <Input
            id={field}
            name={field}
            placeholder={placeholder}
            value={brief[field]}
            onChange={handleChange}
            onFocus={() => setExpandedField(field)}
            onBlur={() => setExpandedField(null)}
            required={required}
            className="bg-slate-950/50 border-slate-700 focus:border-blue-500 transition-all"
          />
        )}

        {isExpanded && SUGGESTIONS[field] && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 mt-2"
          >
            <div className="w-full flex items-center gap-2 mb-1">
              <Lightbulb className="w-3 h-3 text-yellow-500" />
              <span className="text-xs text-slate-400">Quick suggestions:</span>
            </div>
            {SUGGESTIONS[field].map((suggestion, i) => (
              <Button
                key={i}
                type="button"
                variant="outline"
                size="sm"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSuggestionClick(field, suggestion);
                }}
                className="text-xs h-7 bg-slate-800/50 border-slate-700 hover:bg-slate-700 hover:text-blue-300 text-slate-400"
              >
                {suggestion.length > 40 ? suggestion.substring(0, 40) + '...' : suggestion}
              </Button>
            ))}
          </motion.div>
        )}
      </div>
    );
  };

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
          <Wand2 className="mr-2 h-4 w-4" /> Try Example
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Tell Us About Your Presentation</h2>
          <p className="text-slate-400 mb-4">Fill in the details below. The more specific you are, the better your deck will be.</p>

          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {completedFields.size} of 4 required fields completed
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-blue-400">Core Context</CardTitle>
              <CardDescription>The foundation of your presentation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {renderField('topic', 'Topic / Title', 'e.g. Q3 Marketing Strategy', true, false)}
                </div>
                <div>
                  {renderField('audience', 'Target Audience', 'e.g. Board of Directors', true, false)}
                </div>
              </div>

              <div className="pt-2">
                {renderField('objective', 'Objective / Decision Needed', 'What do you want to achieve? e.g. Approve $50k budget for new tools.', true, true)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-indigo-400">Context & Evidence</CardTitle>
              <CardDescription>Help the AI understand your story</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderField('situation', 'Current Situation / Problem', 'Why are we here? e.g. Conversion rates dropped 15% last quarter.', true, true)}
              {renderField('insights', 'Key Insights / Evidence', 'Any data points or key arguments to include?', false, true)}
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={isLoading || !isFormValid}
            size="lg"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-6 text-lg shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating Your Deck...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" /> Generate 5-Slide Deck
              </>
            )}
          </Button>

          {!isFormValid && (
            <p className="text-center text-sm text-slate-500">
              Please complete all required fields marked with *
            </p>
          )}
        </form>
      </motion.div>
    </div>
  );
}
