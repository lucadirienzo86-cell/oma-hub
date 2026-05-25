import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * GET /api/sessions
 * Restituisce le sessioni disponibili per un servizio
 * Query params: service_id (opzionale), from (ISO date)
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const serviceId = searchParams.get('service_id');
  const from = searchParams.get('from') || new Date().toISOString();

  let query = supabase
    .from('sessions')
    .select('*, service:services(*)')
    .gte('start_time', from)
    .order('start_time', { ascending: true })
    .limit(50);

  if (serviceId) {
    query = query.eq('service_id', serviceId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      { error: 'Errore nel recupero sessioni' },
      { status: 500 }
    );
  }

  return NextResponse.json({ sessions: data });
}
