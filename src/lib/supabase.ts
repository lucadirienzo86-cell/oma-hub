import { createClient, SupabaseClient } from '@supabase/supabase-js';

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

let _supabase: SupabaseClient | null = null;
let _initError: Error | null = null;

function initSupabase(): SupabaseClient | null {
  if (_supabase) return _supabase;
  if (_initError) return null;

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      _initError = new Error('Missing Supabase env vars');
      return null;
    }
    _supabase = createClient(url, key, {
      realtime: { params: { eventsPerSecond: 10 } },
    });
    return _supabase;
  } catch (e) {
    _initError = e as Error;
    return null;
  }
}

// Proxy that never throws at import time, only on actual use
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = initSupabase();
    if (!client) {
      // Return no-op for chaining, real error only on await
      if (prop === 'from') {
        return () => ({
          select: () => ({ eq: () => ({ order: () => Promise.resolve({ data: [], error: _initError }) }) }),
        });
      }
      return () => null;
    }
    return client[prop as keyof SupabaseClient];
  },
});
