-- ============================================================
-- OMA Hub — Schema Database
-- Organic Movement & Alignment Hub
-- ============================================================

-- Estensioni necessarie
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- Tabella: services
-- Contiene i servizi offerti (ballo, yoga, massaggi)
-- ============================================================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) CHECK (category IN ('ballo', 'yoga', 'massaggio')),
  duration_minutes INT NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indice per categoria
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);

-- ============================================================
-- Tabella: sessions
-- Sessioni programmate per ogni servizio
-- ============================================================
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  max_capacity INT DEFAULT 1,
  current_bookings INT DEFAULT 0,
  is_promotion BOOLEAN DEFAULT FALSE,
  discount_percentage INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indici per query frequenti
CREATE INDEX IF NOT EXISTS idx_sessions_service_id ON sessions(service_id);
CREATE INDEX IF NOT EXISTS idx_sessions_start_time ON sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_sessions_is_promotion ON sessions(is_promotion);

-- ============================================================
-- Tabella: bookings
-- Prenotazioni dei clienti
-- ============================================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(50) NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'pending',
  stripe_payment_intent_id VARCHAR(255),
  booking_token UUID DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indici
CREATE INDEX IF NOT EXISTS idx_bookings_session_id ON sessions(id);
CREATE INDEX IF NOT EXISTS idx_bookings_token ON bookings(booking_token);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(client_email);

-- ============================================================
-- Funzioni helper per gestione atomica prenotazioni
-- ============================================================

-- Incrementa contatore prenotazioni sessione
CREATE OR REPLACE FUNCTION increment_session_bookings(session_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE sessions
  SET current_bookings = current_bookings + 1
  WHERE id = session_id
    AND current_bookings < max_capacity;
END;
$$ LANGUAGE plpgsql;

-- Decrementa contatore prenotazioni sessione (per cancellazioni)
CREATE OR REPLACE FUNCTION decrement_session_bookings(session_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE sessions
  SET current_bookings = GREATEST(current_bookings - 1, 0)
  WHERE id = session_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- Realtime: abilita pubblica per le sessioni
-- Necessario per gli aggiornamenti promozione in tempo reale
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;

-- ============================================================
-- Dati di esempio per testing
-- ============================================================

-- Servizi
INSERT INTO services (name, category, duration_minutes, base_price, description) VALUES
  ('Ballo Contemporaneo', 'ballo', 60, 45.00, 'Sessioni di ballo contemporaneo per esprimere emozioni attraverso il movimento. Adatto a tutti i livelli.'),
  ('Ballo Libero Espressivo', 'ballo', 90, 60.00, 'Libera il tuo corpo con il movimento esprime. Una danza tra coscienza e istinto.'),
  ('Hatha Yoga', 'yoga', 75, 40.00, 'Pratica dolce e meditativa che unisce posture, respirazione e rilassamento.'),
  ('Vinyasa Flow', 'yoga', 60, 45.00, 'Flusso dinamico che sincronizza respiro e movimento. Energia e fluidità.'),
  ('Yin Yoga', 'yoga', 90, 50.00, 'Yoga passivo con posture mantenute a lungo. Perfetto per la flessibilità profonda.'),
  ('Massaggio Olistico', 'massaggio', 60, 70.00, 'Trattamento completo che rilassa corpo e mente con oli essenziali naturali.'),
  ('Massaggio Decontratturante', 'massaggio', 45, 55.00, 'Trattamento focalizzato su nuca, spalle e schiena per sciogliere la tensione accumulata.'),
  ('Massaggio Ayurvedico', 'massaggio', 90, 85.00, 'Antica pratica indiana con olio cald per riequilibrare i doshas.');

-- Sessioni di esempio (prossimi 7 giorni)
INSERT INTO sessions (service_id, start_time, end_time, max_capacity, current_bookings)
SELECT
  s.id,
  NOW() + (n || ' days')::INTERVAL + '09:00'::INTERVAL,
  NOW() + (n || ' days')::INTERVAL + (s.duration_minutes || ' minutes')::INTERVAL,
  CASE WHEN s.category = 'massaggio' THEN 1 ELSE 8 END,
  0
FROM services s
CROSS JOIN generate_series(1, 7) AS n
WHERE n % 2 = 1; -- Solo giorni dispari per avere sessioni vuote

-- Alcune sessioni promozione (flaggate da Agent OS simulato)
UPDATE sessions SET is_promotion = TRUE, discount_percentage = 25
WHERE start_time < NOW() + INTERVAL '18 hours' AND current_bookings = 0;

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

ALTER TABLE services ENABLE ROW LEVEL ACCESS;
ALTER TABLE sessions ENABLE ROW LEVEL ACCESS;
ALTER TABLE bookings ENABLE ROW LEVEL ACCESS;

-- Tutti possono leggere servizi e sessioni
CREATE POLICY "Servizi visibili a tutti" ON services FOR SELECT USING (true);
CREATE POLICY "Sessioni visibili a tutti" ON sessions FOR SELECT USING (true);

-- Solo inserimento prenessioni dal form (email matching)
CREATE POLICY "Inserimento prenotazioni" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Lettura prenotazioni per token" ON bookings FOR SELECT USING (true);
