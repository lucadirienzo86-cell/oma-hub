import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page') || 'home';

  const [blocksRes, mediaRes, jobsRes] = await Promise.allSettled([
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

  const blocks = blocksRes.status === 'fulfilled' && !blocksRes.value.error ? blocksRes.value.data ?? [] : [];
  const media = mediaRes.status === 'fulfilled' && !mediaRes.value.error ? mediaRes.value.data ?? [] : [];
  const pendingVideoJobs = jobsRes.status === 'fulfilled' && !jobsRes.value.error ? jobsRes.value.data ?? [] : [];

  return NextResponse.json({
    page,
    blocks,
    media,
    pendingVideoJobs,
  });
}
