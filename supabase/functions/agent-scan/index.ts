/**
 * Supabase Edge Function: Agent OS Scan
 * 
 * Identifica sessioni vuote nelle prossime 18h e le flagga come promozionali.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req: Request) => {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Non autorizzato' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const now = new Date();
    const eighteenHoursLater = new Date(now.getTime() + 18 * 60 * 60 * 1000);

    const { data: emptySessions, error: selectErr } = await supabase
      .from('sessions')
      .select('id')
      .eq('current_bookings', 0)
      .eq('is_promotion', false)
      .gt('start_time', now.toISOString())
      .lt('start_time', eighteenHoursLater.toISOString());

    if (selectErr) throw selectErr;

    let updatedCount = 0;
    if (emptySessions && emptySessions.length > 0) {
      const ids = emptySessions.map((s: Record<string, unknown>) => String(s.id));
      const { error: updateErr } = await supabase
        .from('sessions')
        .update({ is_promotion: true, discount_percentage: 25 })
        .in('id', ids);

      if (updateErr) throw updateErr;
      updatedCount = emptySessions.length;
    }

    return new Response(
      JSON.stringify({ success: true, promoted: updatedCount, scanned_at: now.toISOString() }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Agent OS Scan Error:', err);
    return new Response(
      JSON.stringify({ error: 'Errore scansione agent' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
