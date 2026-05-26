from pathlib import Path

OUT = Path('/Users/luca/Desktop/OMA-HUB/supabase/seed_guapacha_media.sql')

items = [
    {
        'key': 'hero_home',
        'page': 'home',
        'section': 'hero',
        'asset_type': 'video',
        'source': 'grok',
        'title': 'Hero editorial Guapacha',
        'description': 'Video full-bleed in stile yes-dancebiennale: danza sociale, coppie reali, luce calda, Roma Parioli.',
        'url': 'https://PLACEHOLDER/hero_home.mp4',
        'poster_url': 'https://PLACEHOLDER/hero_home.jpg',
        'duration_seconds': 12,
        'aspect_ratio': '16:9',
        'sort_order': 1,
    },
    {
        'key': 'courses_social',
        'page': 'home',
        'section': 'courses',
        'asset_type': 'video',
        'source': 'grok',
        'title': 'Corsi social dance',
        'description': 'Lezione elegante e autentica, persone reali che imparano e si muovono insieme.',
        'url': 'https://PLACEHOLDER/courses_social.mp4',
        'poster_url': 'https://PLACEHOLDER/courses_social.jpg',
        'duration_seconds': 10,
        'aspect_ratio': '16:9',
        'sort_order': 2,
    },
    {
        'key': 'wedding_first_dance',
        'page': 'home',
        'section': 'wedding',
        'asset_type': 'video',
        'source': 'grok',
        'title': 'Wedding first dance',
        'description': 'Coreografia romantica e raffinata per il giorno del matrimonio.',
        'url': 'https://PLACEHOLDER/wedding_first_dance.mp4',
        'poster_url': 'https://PLACEHOLDER/wedding_first_dance.jpg',
        'duration_seconds': 10,
        'aspect_ratio': '16:9',
        'sort_order': 3,
    },
    {
        'key': 'events_night',
        'page': 'home',
        'section': 'events',
        'asset_type': 'video',
        'source': 'grok',
        'title': 'Eventi serali',
        'description': 'Community night, performance e vibrazione upscale.',
        'url': 'https://PLACEHOLDER/events_night.mp4',
        'poster_url': 'https://PLACEHOLDER/events_night.jpg',
        'duration_seconds': 10,
        'aspect_ratio': '16:9',
        'sort_order': 4,
    },
    {
        'key': 'pro_session',
        'page': 'home',
        'section': 'pro',
        'asset_type': 'video',
        'source': 'grok',
        'title': 'Corsi PRO',
        'description': 'Livello avanzato, correzione tecnica, presenza scenica.',
        'url': 'https://PLACEHOLDER/pro_session.mp4',
        'poster_url': 'https://PLACEHOLDER/pro_session.jpg',
        'duration_seconds': 10,
        'aspect_ratio': '16:9',
        'sort_order': 5,
    },
    {
        'key': 'private_session',
        'page': 'home',
        'section': 'private',
        'asset_type': 'video',
        'source': 'grok',
        'title': 'Sessioni individuali 1:1',
        'description': 'Percorso personale su postura, musicalità e crescita.',
        'url': 'https://PLACEHOLDER/private_session.mp4',
        'poster_url': 'https://PLACEHOLDER/private_session.jpg',
        'duration_seconds': 10,
        'aspect_ratio': '16:9',
        'sort_order': 6,
    },
    {
        'key': 'community_backstage',
        'page': 'home',
        'section': 'community',
        'asset_type': 'video',
        'source': 'grok',
        'title': 'Community backstage',
        'description': 'Momenti reali, gruppo, energia e identità di studio.',
        'url': 'https://PLACEHOLDER/community_backstage.mp4',
        'poster_url': 'https://PLACEHOLDER/community_backstage.jpg',
        'duration_seconds': 10,
        'aspect_ratio': '16:9',
        'sort_order': 7,
    },
]

def q(v):
    return "'" + str(v).replace("'", "''") + "'"

lines = ['BEGIN;\n']
for item in items:
    cols = ['key','page','section','asset_type','source','title','description','url','poster_url','duration_seconds','aspect_ratio','sort_order','is_active']
    vals = [q(item['key']), q(item['page']), q(item['section']), q(item['asset_type']), q(item['source']), q(item['title']), q(item['description']), q(item['url']), q(item['poster_url']), str(item['duration_seconds']), q(item['aspect_ratio']), str(item['sort_order']), 'true']
    lines.append(
        f"INSERT INTO media_assets ({', '.join(cols)}) VALUES ({', '.join(vals)}) ON CONFLICT (key) DO NOTHING;\n"
    )
lines.append('COMMIT;\n')
OUT.write_text(''.join(lines), encoding='utf-8')
print(f'Wrote {OUT}')
