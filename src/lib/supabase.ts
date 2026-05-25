import { createClient } from '@supabase/supabase-js';

// Client Supabase per il browser
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Tipi per il database
export interface Service {
  id: string;
  name: string;
  category: 'ballo' | 'yoga' | 'massaggio';
  duration_minutes: number;
  base_price: number;
  description: string | null;
  image_url: string | null;
}

export interface Session {
  id: string;
  service_id: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
  current_bookings: number;
  is_promotion: boolean;
  discount_percentage: number;
  created_at: string;
  service?: Service;
}

export interface Booking {
  id: string;
  session_id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  payment_status: string;
  stripe_payment_intent_id: string | null;
  booking_token: string;
  created_at: string;
  session?: Session;
}
