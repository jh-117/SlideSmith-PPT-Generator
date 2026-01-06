import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import {
  Plus,
  Search,
  Clock,
  Star,
  Trash2,
  FileText,
  Sparkles,
  ArrowRight,
  MoreVertical
} from 'lucide-react';
import { motion } from 'motion/react';
import { PresentationRecord, loadAllPresentations, deletePresentation, toggleFavorite } from '../lib/database';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface DashboardProps {
  onCreateNew: () => void;
  onOpenPresentation: (id: string) => void;
  onPrivacyPolicyClick: () => void;
}

export function Dashboard({ onCreateNew, onOpenPresentation, onPrivacyPolicyClick }: DashboardProps) {
  const [presentations, setPresentations] = useState<PresentationRecord[]>([]);
  const [filteredPresentations, setFilteredPresentations] = useState<PresentationRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');

  useEffect(() => {
    loadPresentations();
  }, []);

  useEffect(() => {
    filterPresentations();
  }, [searchQuery, presentations, filter]);

  const loadPresentations = async () => {
    try {
      setIsLoading(true);
      const data = await loadAllPresentations();
      setPresentations(data);
    } catch (error) {
      toast.error('Failed to load presentations');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterPresentations = () => {
    let filtered = presentations;

    if (filter === 'favorites') {
      filtered = filtered.filter(p => p.is_favorite);
    }

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.audience.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPresentations(filtered);
  };

  const handleDelete = async (id: string, topic: string) => {
    if (!confirm(`Delete "${topic}"? This action cannot be undone.`)) return;

    try {
      await deletePresentation(id);
      setPresentations(prev => prev.filter(p => p.id !== id));
      toast.success('Presentation deleted');
    } catch (error) {
      toast.error('Failed to delete presentation');
      console.error(error);
    }
  };

  const handleToggleFavorite = async (id: string, currentState: boolean) => {
    try {
      await toggleFavorite(id, !currentState);
      setPresentations(prev =>
        prev.map(p => (p.id === id ? { ...p, is_favorite: !currentState } : p))
      );
      toast.success(currentState ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      toast.error('Failed to update favorite');
      console.error(error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-blue-400" />
                SlideSmith
              </h1>
              <p className="text-sm text-slate-400 mt-1">Your AI presentation workspace</p>
            </div>
            <Button
              onClick={onCreateNew}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Presentation
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search presentations..."
                className="pl-10 bg-slate-900/50 border-slate-700"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={filter === 'favorites' ? 'default' : 'outline'}
                onClick={() => setFilter('favorites')}
                size="sm"
              >
                <Star className="w-4 h-4 mr-2" />
                Favorites
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-slate-900/50 border-slate-800 animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-slate-800 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-slate-800 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-slate-800 rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredPresentations.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-800/50 flex items-center justify-center">
              <FileText className="w-12 h-12 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">
              {searchQuery || filter === 'favorites' ? 'No presentations found' : 'No presentations yet'}
            </h3>
            <p className="text-slate-500 mb-6">
              {searchQuery || filter === 'favorites'
                ? 'Try adjusting your search or filters'
                : 'Create your first AI-powered presentation deck'}
            </p>
            {!searchQuery && filter === 'all' && (
              <Button onClick={onCreateNew} size="lg">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Deck
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPresentations.map((presentation, index) => (
              <motion.div
                key={presentation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white mb-2 truncate group-hover:text-blue-400 transition-colors">
                          {presentation.topic}
                        </h3>
                        <p className="text-sm text-slate-400 truncate">
                          For {presentation.audience}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleFavorite(presentation.id, presentation.is_favorite);
                            }}
                          >
                            <Star className="w-4 h-4 mr-2" />
                            {presentation.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(presentation.id, presentation.topic);
                            }}
                            className="text-red-400 focus:text-red-400"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(presentation.updated_at)}
                      </div>
                      {presentation.is_favorite && (
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      )}
                    </div>

                    <Button
                      onClick={() => onOpenPresentation(presentation.id)}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-white"
                    >
                      Open
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-16 border-t border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center">
          <button
            onClick={onPrivacyPolicyClick}
            className="text-slate-400 hover:text-blue-400 text-sm transition-colors"
          >
            Privacy Policy
          </button>
          <p className="text-xs text-slate-600 mt-2">
            © {new Date().getFullYear()} SlideSmith AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
