-- ============================================================
-- Guapacha Seed Data
-- Categorie reali: corsi, corsi PRO, wedding, eventi, sessioni individuali
-- ============================================================

BEGIN;

-- Pulisce eventuali seed precedenti del progetto OMA demo
DELETE FROM bookings WHERE session_id IN (SELECT id FROM sessions WHERE service_id IN (SELECT id FROM services WHERE name ILIKE 'Guapacha%'));
DELETE FROM sessions WHERE service_id IN (SELECT id FROM services WHERE name ILIKE 'Guapacha%');
DELETE FROM services WHERE name ILIKE 'Guapacha%';

-- ============================================================
-- Services
-- ============================================================
INSERT INTO services (name, category, duration_minutes, base_price, description, image_url)
VALUES
  (
    'Guapacha Corsi',
    'ballo',
    60,
    45.00,
    'Social dance, tecnica e musicalità per imparare con eleganza e presenza. Percorso base adatto a chi vuole iniziare o consolidare il proprio stile.',
    NULL
  ),
  (
    'Guapacha Corsi PRO',
    'yoga',
    90,
    75.00,
    'Percorso avanzato per danzatori e allievi che vogliono metodo, precisione, postura e una crescita concreta.',
    NULL
  ),
  (
    'Guapacha Wedding',
    'ballo',
    75,
    120.00,
    'First dance, preparazione emotiva e coreografia elegante per il giorno speciale. Ideale per coppie e matrimoni premium.',
    NULL
  ),
  (
    'Guapacha Eventi',
    'ballo',
    90,
    180.00,
    'Format per eventi, serate, show e community nights. Performance e atmosfera upscale su misura.',
    NULL
  ),
  (
    'Guapacha Sessioni Individuali',
    'massaggio',
    60,
    90.00,
    'Sessioni 1:1 su obiettivi specifici: postura, musicalità, sicurezza, presenza scenica e miglioramento tecnico.',
    NULL
  );

-- ============================================================
-- Sessions: prossime 2 settimane, mix contenuto reale
-- ============================================================
INSERT INTO sessions (service_id, start_time, end_time, max_capacity, current_bookings, is_promotion, discount_percentage)
SELECT
  s.id,
  NOW() + (n || ' days')::INTERVAL +
    CASE
      WHEN s.name ILIKE '%Wedding%' THEN '19:30'::INTERVAL
      WHEN s.name ILIKE '%Eventi%' THEN '20:30'::INTERVAL
      WHEN s.name ILIKE '%PRO%' THEN '18:30'::INTERVAL
      WHEN s.name ILIKE '%Individuali%' THEN '10:00'::INTERVAL
      ELSE '18:00'::INTERVAL
    END,
  NOW() + (n || ' days')::INTERVAL +
    CASE
      WHEN s.name ILIKE '%Wedding%' THEN '20:45'::INTERVAL
      WHEN s.name ILIKE '%Eventi%' THEN '22:00'::INTERVAL
      WHEN s.name ILIKE '%PRO%' THEN '20:00'::INTERVAL
      WHEN s.name ILIKE '%Individuali%' THEN '11:00'::INTERVAL
      ELSE '19:00'::INTERVAL
    END,
  CASE
    WHEN s.name ILIKE '%Individuali%' THEN 1
    WHEN s.name ILIKE '%Wedding%' THEN 2
    WHEN s.name ILIKE '%Eventi%' THEN 40
    WHEN s.name ILIKE '%PRO%' THEN 12
    ELSE 16
  END,
  0,
  CASE WHEN n IN (2, 5, 9, 12) AND s.name ILIKE '%Corsi%' THEN TRUE ELSE FALSE END,
  CASE WHEN n IN (2, 5, 9, 12) AND s.name ILIKE '%Corsi%' THEN 20 ELSE 0 END
FROM services s
CROSS JOIN generate_series(1, 14) AS n
WHERE s.name LIKE 'Guapacha%';

-- alcune sessioni già quasi sold-out per mostrare urgenza sul sito
UPDATE sessions
SET current_bookings = CASE
  WHEN max_capacity = 1 THEN 0
  WHEN max_capacity <= 2 THEN 1
  ELSE LEAST(max_capacity - 2, current_bookings + 4)
END
WHERE is_promotion = TRUE;

COMMIT;
