BEGIN;

INSERT INTO media_assets (key, page, section, asset_type, source, title, description, url, poster_url, duration_seconds, aspect_ratio, sort_order, is_active) VALUES
('hero_home', 'home', 'hero', 'video', 'grok', 'Hero editorial Guapacha', 'Video full-bleed in stile yes-dancebiennale: danza sociale, coppie reali, luce calda, Roma Parioli.', 'https://vidgen.x.ai/xai-vidgen-bucket/xai-video-dcbe1362-feb2-4796-b206-6a815b7d3196.mp4', NULL, 12, '16:9', 1, true),
('courses_social', 'home', 'courses', 'video', 'grok', 'Corsi social dance', 'Lezione elegante e autentica, persone reali che imparano e si muovono insieme.', 'https://vidgen.x.ai/xai-vidgen-bucket/xai-video-49d91b12-b978-413a-963d-500f61c4490d.mp4', NULL, 12, '16:9', 2, true),
('pro_session', 'home', 'pro', 'video', 'grok', 'Corsi PRO', 'Livello avanzato, correzione tecnica, presenza scenica.', 'https://vidgen.x.ai/xai-vidgen-bucket/xai-video-1728da80-e6f6-4f1c-8b73-63af2892089a.mp4', NULL, 12, '16:9', 3, true),
('wedding_first_dance', 'home', 'wedding', 'video', 'grok', 'Wedding first dance', 'Coreografia romantica e raffinata per il giorno del matrimonio.', 'https://vidgen.x.ai/xai-vidgen-bucket/xai-video-7275117c-da47-42e8-b5ac-d166ad3ad407.mp4', NULL, 12, '16:9', 4, true),
('events_night', 'home', 'events', 'video', 'grok', 'Eventi serali', 'Community night, performance e vibrazione upscale.', 'https://vidgen.x.ai/xai-vidgen-bucket/xai-video-d3aa6c12-1f38-4eb0-9f63-cd2d79eae3b4.mp4', NULL, 12, '16:9', 5, true),
('private_session', 'home', 'private', 'video', 'grok', 'Sessioni individuali 1:1', 'Percorso personale su postura, musicalità e crescita.', 'https://vidgen.x.ai/xai-vidgen-bucket/xai-video-544e59e0-6a08-4563-9e75-2547dfce7ec6.mp4', NULL, 12, '16:9', 6, true),
('community_backstage', 'home', 'community', 'video', 'grok', 'Community backstage', 'Momenti reali, gruppo, energia e identità di studio.', 'https://vidgen.x.ai/xai-vidgen-bucket/xai-video-b6ba83ad-0b64-4181-9f49-9dc252538ea4.mp4', NULL, 12, '16:9', 7, true)
ON CONFLICT (key) DO UPDATE SET
  url = EXCLUDED.url,
  poster_url = EXCLUDED.poster_url,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  duration_seconds = EXCLUDED.duration_seconds,
  aspect_ratio = EXCLUDED.aspect_ratio,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

COMMIT;
