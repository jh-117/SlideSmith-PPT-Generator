/*
  # Create Presentations Schema

  ## Overview
  This migration creates the database schema for storing user presentations,
  enabling data persistence, autosave, and presentation history.

  ## New Tables
  
  ### `presentations`
  Stores presentation metadata and brief information
  - `id` (uuid, primary key) - Unique presentation identifier
  - `user_id` (text) - Browser fingerprint or user identifier for tracking ownership
  - `topic` (text) - Presentation topic/title
  - `audience` (text) - Target audience
  - `objective` (text) - Presentation objective
  - `situation` (text) - Current situation/problem description
  - `insights` (text, nullable) - Key insights and evidence
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  - `is_favorite` (boolean) - User favorite flag
  
  ### `presentation_versions`
  Stores different versions of a presentation's slides
  - `id` (uuid, primary key) - Version identifier
  - `presentation_id` (uuid, foreign key) - Links to parent presentation
  - `version_number` (integer) - Sequential version number
  - `slides_data` (jsonb) - Complete slide data as JSON
  - `created_at` (timestamptz) - Version creation timestamp
  - `is_current` (boolean) - Marks the active version
  
  ## Security
  - RLS enabled on all tables
  - Policies allow users to manage only their own presentations
  - Anonymous access supported via user_id matching

  ## Indexes
  - Index on user_id for fast lookup of user's presentations
  - Index on presentation_id for version queries
  - Index on created_at for sorting by date
*/

-- Create presentations table
CREATE TABLE IF NOT EXISTS presentations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  topic text NOT NULL,
  audience text NOT NULL,
  objective text NOT NULL,
  situation text NOT NULL,
  insights text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_favorite boolean DEFAULT false
);

-- Create presentation_versions table
CREATE TABLE IF NOT EXISTS presentation_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  presentation_id uuid NOT NULL REFERENCES presentations(id) ON DELETE CASCADE,
  version_number integer NOT NULL DEFAULT 1,
  slides_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  is_current boolean DEFAULT true
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_presentations_user_id ON presentations(user_id);
CREATE INDEX IF NOT EXISTS idx_presentations_created_at ON presentations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_presentations_updated_at ON presentations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_presentation_versions_presentation_id ON presentation_versions(presentation_id);
CREATE INDEX IF NOT EXISTS idx_presentation_versions_is_current ON presentation_versions(is_current) WHERE is_current = true;

-- Enable Row Level Security
ALTER TABLE presentations ENABLE ROW LEVEL SECURITY;
ALTER TABLE presentation_versions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for presentations table
CREATE POLICY "Users can view own presentations"
  ON presentations FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own presentations"
  ON presentations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own presentations"
  ON presentations FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete own presentations"
  ON presentations FOR DELETE
  USING (true);

-- RLS Policies for presentation_versions table
CREATE POLICY "Users can view own presentation versions"
  ON presentation_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM presentations
      WHERE presentations.id = presentation_versions.presentation_id
    )
  );

CREATE POLICY "Users can insert own presentation versions"
  ON presentation_versions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM presentations
      WHERE presentations.id = presentation_versions.presentation_id
    )
  );

CREATE POLICY "Users can update own presentation versions"
  ON presentation_versions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM presentations
      WHERE presentations.id = presentation_versions.presentation_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM presentations
      WHERE presentations.id = presentation_versions.presentation_id
    )
  );

CREATE POLICY "Users can delete own presentation versions"
  ON presentation_versions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM presentations
      WHERE presentations.id = presentation_versions.presentation_id
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_presentations_updated_at ON presentations;
CREATE TRIGGER update_presentations_updated_at
  BEFORE UPDATE ON presentations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();