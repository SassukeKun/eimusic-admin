// app/api/users/[id]/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { UserUpdateData } from '@/types/users';
import { mapUserFromDB } from '@/types/users';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', params.id)
      .single();

    if (userError) {
      if (userError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Usuário não encontrado' },
          { status: 404 }
        );
      }
      throw userError;
    }

    const user = mapUserFromDB(userData);

    return NextResponse.json(user);

  } catch (error) {
    console.error('Erro ao buscar user:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar usuário' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updateData: UserUpdateData = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.paymentMethod !== undefined) {
      updateData.payment_method = body.paymentMethod || null;
    }
    if (body.hasActiveSubscription !== undefined) {
      updateData.has_active_subscription = body.hasActiveSubscription;
    }
    if (body.profileImageUrl !== undefined) {
      updateData.profile_image_url = body.profileImageUrl || null;
    }
    if (body.subscriptionPlanId !== undefined) {
      updateData.subscription_plan_id = body.subscriptionPlanId || null;
    }
    if (body.isAdmin !== undefined) updateData.is_admin = body.isAdmin;

    const { data, error } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Usuário não encontrado' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json(mapUserFromDB(data));

  } catch (error) {
    console.error('Erro ao atualizar user:', error);
    return NextResponse.json(
      { error: 'Falha ao atualizar usuário' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', params.id);

    if (error) throw error;

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Erro ao deletar user:', error);
    return NextResponse.json(
      { error: 'Falha ao deletar usuário' },
      { status: 500 }
    );
  }
}