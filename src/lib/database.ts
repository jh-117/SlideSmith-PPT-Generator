import { supabase, getUserId } from './supabase';
import { Brief, Deck } from './types';

export interface PresentationRecord {
  id: string;
  user_id: string;
  topic: string;
  audience: string;
  objective: string;
  situation: string;
  insights: string;
  created_at: string;
  updated_at: string;
  is_favorite: boolean;
}

export interface VersionRecord {
  id: string;
  presentation_id: string;
  version_number: number;
  slides_data: any;
  created_at: string;
  is_current: boolean;
}

export async function savePresentation(brief: Brief, deck: Deck): Promise<string> {
  const userId = getUserId();

  const { data: presentation, error: presentationError } = await supabase
    .from('presentations')
    .insert({
      user_id: userId,
      topic: brief.topic,
      audience: brief.audience,
      objective: brief.objective,
      situation: brief.situation,
      insights: brief.insights || '',
    })
    .select()
    .maybeSingle();

  if (presentationError || !presentation) {
    throw new Error('Failed to save presentation');
  }

  const { error: versionError } = await supabase
    .from('presentation_versions')
    .insert({
      presentation_id: presentation.id,
      version_number: 1,
      slides_data: deck,
      is_current: true,
    });

  if (versionError) {
    throw new Error('Failed to save presentation version');
  }

  return presentation.id;
}

export async function updatePresentation(presentationId: string, brief: Brief): Promise<void> {
  const { error } = await supabase
    .from('presentations')
    .update({
      topic: brief.topic,
      audience: brief.audience,
      objective: brief.objective,
      situation: brief.situation,
      insights: brief.insights || '',
    })
    .eq('id', presentationId);

  if (error) {
    throw new Error('Failed to update presentation');
  }
}

export async function saveNewVersion(presentationId: string, deck: Deck): Promise<string> {
  const { data: versions } = await supabase
    .from('presentation_versions')
    .select('version_number')
    .eq('presentation_id', presentationId)
    .order('version_number', { ascending: false })
    .limit(1);

  const nextVersionNumber = versions && versions.length > 0 ? versions[0].version_number + 1 : 1;

  await supabase
    .from('presentation_versions')
    .update({ is_current: false })
    .eq('presentation_id', presentationId);

  const { data: newVersion, error } = await supabase
    .from('presentation_versions')
    .insert({
      presentation_id: presentationId,
      version_number: nextVersionNumber,
      slides_data: deck,
      is_current: true,
    })
    .select()
    .maybeSingle();

  if (error || !newVersion) {
    throw new Error('Failed to save new version');
  }

  return newVersion.id;
}

export async function loadPresentation(presentationId: string): Promise<{ brief: Brief; deck: Deck; versions: Deck[] }> {
  const { data: presentation, error: presentationError } = await supabase
    .from('presentations')
    .select('*')
    .eq('id', presentationId)
    .maybeSingle();

  if (presentationError || !presentation) {
    throw new Error('Failed to load presentation');
  }

  const { data: versions, error: versionsError } = await supabase
    .from('presentation_versions')
    .select('*')
    .eq('presentation_id', presentationId)
    .order('version_number', { ascending: true });

  if (versionsError || !versions || versions.length === 0) {
    throw new Error('Failed to load presentation versions');
  }

  const brief: Brief = {
    topic: presentation.topic,
    audience: presentation.audience,
    objective: presentation.objective,
    situation: presentation.situation,
    insights: presentation.insights,
  };

  const allDecks = versions.map(v => v.slides_data as Deck);
  const currentVersion = versions.find(v => v.is_current);
  const currentDeck = currentVersion ? (currentVersion.slides_data as Deck) : allDecks[allDecks.length - 1];

  return { brief, deck: currentDeck, versions: allDecks };
}

export async function loadAllPresentations(): Promise<PresentationRecord[]> {
  const userId = getUserId();

  const { data, error } = await supabase
    .from('presentations')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    throw new Error('Failed to load presentations');
  }

  return data || [];
}

export async function deletePresentation(presentationId: string): Promise<void> {
  const { error } = await supabase
    .from('presentations')
    .delete()
    .eq('id', presentationId);

  if (error) {
    throw new Error('Failed to delete presentation');
  }
}

export async function toggleFavorite(presentationId: string, isFavorite: boolean): Promise<void> {
  const { error } = await supabase
    .from('presentations')
    .update({ is_favorite: isFavorite })
    .eq('id', presentationId);

  if (error) {
    throw new Error('Failed to update favorite status');
  }
}
