// app/api/artists/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { ArtistDB, ArtistCreateData } from '@/types/artists';
import { mapArtistFromDB } from '@/types/artists';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const search = searchParams.get('search') || '';
    const verified = searchParams.get('verified');
    const province = searchParams.get('province');
    const hasMonetization = searchParams.get('hasMonetization');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortDir = searchParams.get('sortDir') || 'desc';

    let query = supabaseAdmin
      .from('artists')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    if (verified !== null && verified !== undefined) {
      query = query.eq('verified', verified === 'true');
    }

    if (province) {
      query = query.eq('province', province);
    }

    if (hasMonetization !== null && hasMonetization !== undefined) {
      if (hasMonetization === 'true') {
        query = query.not('monetization_plan_id', 'is', null);
      } else {
        query = query.is('monetization_plan_id', null);
      }
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    query = query
      .order(sortBy, { ascending: sortDir === 'asc' })
      .range(from, to);

    const { data: artistsData, error: artistsError, count } = await query;

    if (artistsError) throw artistsError;

    // Buscar planos de monetização para os artistas que têm
    const monetizationPlanIds = [...new Set(
      (artistsData || [])
        .map(artist => artist.monetization_plan_id)
        .filter(Boolean)
    )];

    const { data: plansData } = monetizationPlanIds.length > 0
      ? await supabaseAdmin
          .from('monetization_plans')
          .select('id, name')
          .in('id', monetizationPlanIds)
      : { data: [] };

    const plansMap = new Map(
      (plansData || []).map((plan: { id: string; name: string }) => [plan.id, plan.name])
    );

    // Mapear artistas com nomes dos planos
    const artists = (artistsData || []).map((artist: ArtistDB) => ({
      ...mapArtistFromDB(artist),
      monetizationPlanName: artist.monetization_plan_id 
        ? plansMap.get(artist.monetization_plan_id) 
        : undefined,
    }));

    const totalPages = Math.ceil((count || 0) / pageSize);

    return NextResponse.json({
      data: artists,
      total: count || 0,
      page,
      pageSize,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    });

  } catch (error) {
    console.error('Erro ao buscar artists:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar artistas' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const artistData: ArtistCreateData = {
      name: body.name,
      email: body.email,
      bio: body.bio || null,
      phone: body.phone || null,
      monetization_plan_id: body.monetizationPlanId || null,
      profile_image_url: body.profileImageUrl || null,
      social_links: body.socialLinks || null,
      verified: body.verified || false,
      subscribers: 0,
      province: body.province || null,
    };

    const { data, error } = await supabaseAdmin
      .from('artists')
      .insert(artistData)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(mapArtistFromDB(data));

  } catch (error) {
    console.error('Erro ao criar artist:', error);
    return NextResponse.json(
      { error: 'Falha ao criar artista' },
      { status: 500 }
    );
  }
}