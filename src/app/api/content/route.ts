import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page') || 'home';

  const [blocksRes, mediaRes, jobsRes] = await Promise.all([
    supabase
      .from('content_blocks')
      .select('*')
      .eq('page', page)
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('media_assets')
      .select('*')
      .eq('page', page)
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('video_generation_jobs')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true }),
  ]);

  const error = blocksRes.error || mediaRes.error || jobsRes.error;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    page,
    blocks: blocksRes.data ?? [],
    media: mediaRes.data ?? [],
    pendingVideoJobs: jobsRes.data ?? [],
  });
}
