// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { UserDB, UserCreateData } from '@/types/users';
import { mapUserFromDB } from '@/types/users';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const search = searchParams.get('search') || '';
    const hasSubscription = searchParams.get('hasSubscription');
    const isAdmin = searchParams.get('isAdmin');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortDir = searchParams.get('sortDir') || 'desc';

    let query = supabaseAdmin
      .from('users')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    if (hasSubscription !== null && hasSubscription !== undefined) {
      query = query.eq('has_active_subscription', hasSubscription === 'true');
    }

    if (isAdmin !== null && isAdmin !== undefined) {
      query = query.eq('is_admin', isAdmin === 'true');
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    query = query
      .order(sortBy, { ascending: sortDir === 'asc' })
      .range(from, to);

    const { data: usersData, error: usersError, count } = await query;

    if (usersError) throw usersError;

    const users = (usersData || []).map((user: UserDB) => mapUserFromDB(user));

    const totalPages = Math.ceil((count || 0) / pageSize);

    return NextResponse.json({
      data: users,
      total: count || 0,
      page,
      pageSize,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    });

  } catch (error) {
    console.error('Erro ao buscar users:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar usuários' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userData: UserCreateData = {
      name: body.name,
      email: body.email,
      payment_method: body.paymentMethod || null,
      has_active_subscription: body.hasActiveSubscription || false,
      profile_image_url: body.profileImageUrl || null,
      subscription_plan_id: body.subscriptionPlanId || null,
      is_admin: body.isAdmin || false,
    };

    const { data, error } = await supabaseAdmin
      .from('users')
      .insert(userData)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(mapUserFromDB(data));

  } catch (error) {
    console.error('Erro ao criar user:', error);
    return NextResponse.json(
      { error: 'Falha ao criar usuário' },
      { status: 500 }
    );
  }
}