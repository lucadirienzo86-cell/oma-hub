BEGIN;

INSERT INTO media_assets (key, page, section, asset_type, source, title, description, url, poster_url, duration_seconds, aspect_ratio, sort_order, is_active) VALUES
('hero_home', 'home', 'hero', 'video', 'grok', 'Hero editorial Guapacha', 'Video full-bleed in stile yes-dancebiennale: danza sociale, coppie reali, luce calda, Roma Parioli.', 'https://YOUR-VERCEL-BLOB-PUBLIC-BASE/guapacha/videos/hero-home-16x9.mp4', 'https://YOUR-VERCEL-BLOB-PUBLIC-BASE/guapacha/posters/hero-home-16x9.jpg', 12, '16:9', 1, true),
('courses_social', 'home', 'courses', 'video', 'grok', 'Corsi social dance', 'Lezione elegante e autentica, persone reali che imparano e si muovono insieme.', 'https://YOUR-VERCEL-BLOB-PUBLIC-BASE/guapacha/videos/courses-social-16x9.mp4', 'https://YOUR-VERCEL-BLOB-PUBLIC-BASE/guapacha/posters/courses-social-16x9.jpg', 10, '16:9', 2, true),
('wedding_first_dance', 'home', 'wedding', 'video', 'grok', 'Wedding first dance', 'Coreografia romantica e raffinata per il giorno del matrimonio.', 'https://YOUR-VERCEL-BLOB-PUBLIC-BASE/guapacha/videos/wedding-first-dance-16x9.mp4', 'https://YOUR-VERCEL-BLOB-PUBLIC-BASE/guapacha/posters/wedding-first-dance-16x9.jpg', 10, '16:9', 3, true),
('events_night', 'home', 'events', 'video', 'grok', 'Eventi serali', 'Community night, performance e vibrazione upscale.', 'https://YOUR-VERCEL-BLOB-PUBLIC-BASE/guapacha/videos/events-night-16x9.mp4', 'https://YOUR-VERCEL-BLOB-PUBLIC-BASE/guapacha/posters/events-night-16x9.jpg', 10, '16:9', 4, true),
('pro_session', 'home', 'pro', 'video', 'grok', 'Corsi PRO', 'Livello avanzato, correzione tecnica, presenza scenica.', 'https://YOUR-VERCEL-BLOB-PUBLIC-BASE/guapacha/videos/pro-session-16x9.mp4', 'https://YOUR-VERCEL-BLOB-PUBLIC-BASE/guapacha/posters/pro-session-16x9.jpg', 10, '16:9', 5, true),
('private_session', 'home', 'private', 'video', 'grok', 'Sessioni individuali 1:1', 'Percorso personale su postura, musicalità e crescita.', 'https://YOUR-VERCEL-BLOB-PUBLIC-BASE/guapacha/videos/private-session-16x9.mp4', 'https://YOUR-VERCEL-BLOB-PUBLIC-BASE/guapacha/posters/private-session-16x9.jpg', 10, '16:9', 6, true),
('community_backstage', 'home', 'community', 'video', 'grok', 'Community backstage', 'Momenti reali, gruppo, energia e identità di studio.', 'https://YOUR-VERCEL-BLOB-PUBLIC-BASE/guapacha/videos/community-backstage-16x9.mp4', 'https://YOUR-VERCEL-BLOB-PUBLIC-BASE/guapacha/posters/community-backstage-16x9.jpg', 10, '16:9', 7, true),
('social_vertical_reel', 'home', 'social', 'video', 'grok', 'Vertical reel', 'Montaggio verticale premium per social.', 'https://YOUR-VERCEL-BLOB-PUBLIC-BASE/guapacha/videos/social-vertical-9x16.mp4', 'https://YOUR-VERCEL-BLOB-PUBLIC-BASE/guapacha/posters/social-vertical-9x16.jpg', 8, '9:16', 8, true)
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
