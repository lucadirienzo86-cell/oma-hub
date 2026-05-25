-- OMA Hub — Supabase Migration
-- Eseguire nel SQL Editor di Supabase

-- Abilita UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabella Servizi
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('ballo', 'yoga', 'massaggio')),
  duration_minutes INT NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Sessioni / Calendario
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

-- Tabella Prenotazioni
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
CREATE INDEX IF NOT EXISTS idx_sessions_service_id ON sessions(service_id);
CREATE INDEX IF NOT EXISTS idx_sessions_start_time ON sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_sessions_promotion ON sessions(is_promotion) WHERE is_promotion = true;
CREATE INDEX IF NOT EXISTS idx_bookings_session_id ON bookings(session_id);
CREATE INDEX IF NOT EXISTS idx_bookings_token ON bookings(booking_token);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(client_email);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE services;
ALTER PUBLICATION supabase_realtime ADD TABLE sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;

-- RLS (Row Level Security)
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Services: lettura pubblica, scrittura service_role
CREATE POLICY "Services letti da tutti" ON services FOR SELECT USING (true);
CREATE POLICY "Services gestiti da service_role" ON services FOR ALL USING (auth.role() = 'service_role');

-- Sessions: lettura pubblica, scrittura service_role
CREATE POLICY "Sessions letti da tutti" ON sessions FOR SELECT USING (true);
CREATE POLICY "Sessions gestiti da service_role" ON sessions FOR ALL USING (auth.role() = 'service_role');

-- Bookings: inserimento pubblico, lettura solo propria
CREATE POLICY "Prenotazioni inseribili da tutti" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Prenotazioni lete dal proprietario" ON bookings FOR SELECT USING (
  client_email = current_setting('request.jwt.claims.email', true)
);
CREATE POLICY "Bookings gestiti da service_role" ON bookings FOR ALL USING (auth.role() = 'service_role');

-- Funzione: aggiorna current_bookings atomicamente
CREATE OR REPLACE FUNCTION increment_booking_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE sessions SET current_bookings = current_bookings + 1 WHERE id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_increment_booking
  AFTER INSERT ON bookings
  FOR EACH ROW EXECUTE FUNCTION increment_booking_count();

-- Funzione: scan sessioni vuote (Agent OS)
CREATE OR REPLACE FUNCTION scan_empty_sessions()
RETURNS TABLE(id UUID, service_name VARCHAR, start_time TIMESTAMP WITH TIME ZONE) AS $$
BEGIN
  RETURN QUERY
  SELECT s.id, srv.name, s.start_time
  FROM sessions s
  JOIN services srv ON s.service_id = srv.id
  WHERE s.current_bookings = 0
    AND s.is_promotion = false
    AND s.start_time > NOW()
    AND s.start_time <= NOW() + INTERVAL '18 hours';
END;
$$ LANGUAGE plpgsql;
