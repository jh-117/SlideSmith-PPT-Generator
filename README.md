
  # AI PPT Generator App

  This is a code bundle for AI PPT Generator App. The original project is available at https://www.figma.com/design/ePUf3jFw9K57TvGHHNqs2W/AI-PPT-Generator-App.

  ## Setup

  Run `npm i` to install the dependencies.

  ## Running the code

  Run `npm run dev` to start the development server.

  ## Features

  - AI-powered presentation generation using GPT-4
  - Secure API key management via Supabase Edge Functions
  - Automatic image sourcing from Unsplash
  - Interactive slide editor
  - Export to PowerPoint format
  - Version control for your decks

  ## Architecture

  The app uses Supabase Edge Functions to securely handle OpenAI API calls on the backend, ensuring API keys are never exposed to the frontend.
