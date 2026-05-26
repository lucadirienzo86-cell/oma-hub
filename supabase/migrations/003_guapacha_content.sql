-- ============================================================
-- Guapacha Content + Media Schema
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------
-- Content blocks editoriali per homepage / pagine
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  page TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  body TEXT,
  cta_label TEXT,
  cta_href TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_blocks_page ON content_blocks(page);
CREATE INDEX IF NOT EXISTS idx_content_blocks_active ON content_blocks(is_active);

-- ------------------------------------------------------------
-- Media assets (video / image) per sezione
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  page TEXT NOT NULL,
  section TEXT NOT NULL,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('video', 'image', 'gif')),
  source TEXT NOT NULL CHECK (source IN ('real', 'grok', 'stock')),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  poster_url TEXT,
  duration_seconds INT,
  aspect_ratio TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_assets_page ON media_assets(page);
CREATE INDEX IF NOT EXISTS idx_media_assets_section ON media_assets(section);
CREATE INDEX IF NOT EXISTS idx_media_assets_active ON media_assets(is_active);

-- ------------------------------------------------------------
-- Optional: queue per generazione video AI
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS video_generation_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  section TEXT NOT NULL,
  model TEXT NOT NULL DEFAULT 'grok-imagine-video',
  prompt TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'done', 'failed')),
  output_url TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_video_generation_jobs_status ON video_generation_jobs(status);
CREATE INDEX IF NOT EXISTS idx_video_generation_jobs_section ON video_generation_jobs(section);

-- ------------------------------------------------------------
-- RLS
-- ------------------------------------------------------------
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_generation_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "content_blocks public read" ON content_blocks
  FOR SELECT USING (true);
CREATE POLICY "media_assets public read" ON media_assets
  FOR SELECT USING (true);
CREATE POLICY "video_generation_jobs public read" ON video_generation_jobs
  FOR SELECT USING (true);

CREATE POLICY "content_blocks service_role all" ON content_blocks
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "media_assets service_role all" ON media_assets
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "video_generation_jobs service_role all" ON video_generation_jobs
  FOR ALL USING (auth.role() = 'service_role');

-- ------------------------------------------------------------
-- Timestamps auto-update
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_content_blocks_updated_at ON content_blocks;
CREATE TRIGGER trg_content_blocks_updated_at
  BEFORE UPDATE ON content_blocks
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_media_assets_updated_at ON media_assets;
CREATE TRIGGER trg_media_assets_updated_at
  BEFORE UPDATE ON media_assets
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_video_generation_jobs_updated_at ON video_generation_jobs;
CREATE TRIGGER trg_video_generation_jobs_updated_at
  BEFORE UPDATE ON video_generation_jobs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ------------------------------------------------------------
-- Seed base homepage content
-- ------------------------------------------------------------
INSERT INTO content_blocks (key, page, title, subtitle, body, cta_label, cta_href, sort_order)
VALUES
  ('home_hero', 'home', 'Movement. Elegance. Community.', 'Guapacha — Roma Parioli', 'Social dance, wedding, eventi, corsi PRO e sessioni individuali.', 'Scopri i corsi', '/servizi', 1),
  ('home_manifesto', 'home', 'Corpo, mente e anima in movimento.', NULL, 'Guapacha è uno spazio dove la danza diventa esperienza, relazione e stile.', NULL, NULL, 2),
  ('home_courses', 'home', 'I percorsi Guapacha', NULL, 'Corsi, PRO, wedding, eventi e sessioni 1:1 raccontati in modo editoriale.', NULL, NULL, 3)
ON CONFLICT (key) DO NOTHING;

-- ------------------------------------------------------------
-- Seed prompts for Grok video generation
-- ------------------------------------------------------------
INSERT INTO video_generation_jobs (key, section, model, prompt, status)
VALUES
  ('hero_home', 'hero', 'grok-imagine-video', 'Video hero editoriale per Guapacha a Roma Parioli, stile yes-dancebiennale, luxury movement studio, danza sociale, coppie reali, luce calda, taglio culturale premium, camera fluida, 10 secondi, 16:9, tono elegante e contemporaneo.', 'pending'),
  ('courses_social', 'courses', 'grok-imagine-video', 'Video AI per corsi di social dance, studio elegante, persone reali che imparano, coppie in movimento, atmosfera premium romana, taglio editoriale, 10 secondi, 16:9.', 'pending'),
  ('wedding_first_dance', 'wedding', 'grok-imagine-video', 'Video AI wedding per first dance elegante, prova coreografia, dettagli mani e abiti, emozione, stile cinematografico raffinato, 10 secondi, 16:9.', 'pending'),
  ('events_night', 'events', 'grok-imagine-video', 'Video AI eventi serali Guapacha, community, social dance, luci calde, networking, atmosfera upscale romana, 10 secondi, 16:9.', 'pending'),
  ('pro_session', 'pro', 'grok-imagine-video', 'Video AI per corsi PRO, livello avanzato, correzioni tecniche, postura, precisione, look istituzionale ed elegante, 10 secondi, 16:9.', 'pending'),
  ('private_session', 'private', 'grok-imagine-video', 'Video AI per sessione individuale 1:1, studio intimo, attenzione personalizzata, postura e musicalità, stile premium, 10 secondi, 16:9.', 'pending'),
  ('community_backstage', 'community', 'grok-imagine-video', 'Video AI community/backstage, risate, abbracci, gruppo, vita di studio autentica, energia reale, 10 secondi, 16:9.', 'pending')
ON CONFLICT (key) DO NOTHING;
