import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Eye, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Brief } from '../lib/types';

interface Example {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  brief: Brief;
}

const EXAMPLES: Example[] = [
  {
    id: '1',
    title: 'Product Launch Pitch',
    description: 'Investor pitch for a new SaaS product targeting enterprises',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400&auto=format&fit=crop',
    brief: {
      topic: 'CloudSync AI Product Launch',
      audience: 'Series A Investors',
      objective: 'Secure $2M in Series A funding to scale our AI-powered cloud synchronization platform.',
      situation: 'The market for enterprise cloud solutions is growing at 25% annually, but current solutions lack intelligent automation. Our beta users report 40% time savings.',
      insights: 'Beta testing with 50 enterprise clients showed 40% reduction in manual sync tasks, 99.9% uptime, and NPS score of 72. Total addressable market is $8.5B.',
    },
  },
  {
    id: '2',
    title: 'Quarterly Business Review',
    description: 'Executive summary of Q3 performance and Q4 strategy',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&auto=format&fit=crop',
    brief: {
      topic: 'Q3 2024 Business Review',
      audience: 'Executive Leadership Team',
      objective: 'Review Q3 performance, align on Q4 priorities, and secure approval for strategic initiatives.',
      situation: 'Q3 revenue grew 18% YoY but margins compressed by 3% due to increased customer acquisition costs. Retention remains strong at 94%.',
      insights: 'Top-performing segment is enterprise (35% growth), while SMB segment declined 5%. Customer feedback indicates strong demand for expanded API capabilities.',
    },
  },
  {
    id: '3',
    title: 'Marketing Strategy Update',
    description: 'New marketing campaign strategy for upcoming product features',
    thumbnail: 'https://images.unsplash.com/photo-1557838923-2985c318be48?q=80&w=400&auto=format&fit=crop',
    brief: {
      topic: 'H1 2025 Marketing Strategy',
      audience: 'Marketing Department & Leadership',
      objective: 'Align team on new multi-channel campaign strategy and secure budget approval for $150k in additional marketing spend.',
      situation: 'Our current CAC is 20% higher than industry average. Competitor analysis shows they are outspending us 3:1 on content marketing.',
      insights: 'A/B testing shows video content converts 2.5x better than static ads. LinkedIn campaigns have 40% lower CPA than other channels for our ICP.',
    },
  },
  {
    id: '4',
    title: 'Remote Work Policy',
    description: 'Proposal for updated hybrid work policies',
    thumbnail: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=400&auto=format&fit=crop',
    brief: {
      topic: 'Hybrid Work Policy 2.0',
      audience: 'All Employees & HR Team',
      objective: 'Introduce updated hybrid work policy that balances flexibility with collaboration needs.',
      situation: 'Current policy of 100% remote led to 35% decline in cross-team collaboration. Employee survey shows 82% want some in-office time.',
      insights: 'Companies with 3-day office weeks report 25% higher employee satisfaction. Our office space can accommodate 60% of team at once.',
    },
  },
];

interface ExampleGalleryProps {
  onSelectExample: (brief: Brief) => void;
  onClose: () => void;
}

export function ExampleGallery({ onSelectExample, onClose }: ExampleGalleryProps) {
  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white mb-6">
            <ArrowRight className="mr-2 h-4 w-4 rotate-180" /> Back
          </Button>
          <h2 className="text-3xl font-bold text-white mb-2">Example Presentations</h2>
          <p className="text-slate-400">
            Browse examples to get inspired, or use one as a starting point for your own deck
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EXAMPLES.map((example, index) => (
            <motion.div
              key={example.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all group overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={example.thumbnail}
                    alt={example.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {example.title}
                  </h3>
                  <p className="text-sm text-slate-400 mb-4">{example.description}</p>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => onSelectExample(example.brief)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
                    >
                      Use This Brief
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-slate-700 hover:bg-slate-800"
                      title="Preview brief details"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
