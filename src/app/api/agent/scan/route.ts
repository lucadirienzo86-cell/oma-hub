import { NextRequest, NextResponse } from 'next/server';

const AGENT_SECRET = process.env.AGENT_SECRET_KEY;

/**
 * POST /api/agent/scan
 * Trigger per l'Agent OS per scan sessioni vuoti
 * Gestito anche come Edge Function Supabase
 */
export async function POST(req: NextRequest) {
  // Verifica autorizzazione
  const authHeader = req.headers.get('authorization');
  if (!authHeader || authHeader !== `Bearer ${AGENT_SECRET}`) {
    return NextResponse.json(
      { error: 'Non autorizzato' },
      { status: 401 }
    );
  }

  try {
    // Questo endpoint può essere chiamato da un cron job esterno
    // o dall'Agent OS direttamente
    return NextResponse.json({
      success: true,
      message: 'Agent scan triggered',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Errore agent scan:', err);
    return NextResponse.json(
      { error: 'Errore nell\'esecuzione dello scan' },
      { status: 500 }
    );
  }
}
