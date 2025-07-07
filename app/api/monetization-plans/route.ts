// app/api/monetization-plans/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Interface baseada na estrutura real
interface MonetizationPlanDB {
  id: string;
  name: string;
  monetization_type: string;
  platform_fee: string; // numeric no DB vem como string
  description: string | null;
  created_at: string;
}

// Interface para a aplicação
interface MonetizationPlan {
  id: string;
  name: string;
  monetization_type: string;
  platform_fee: number; // Convertido para number
  artist_share: number; // Calculado: 1 - platform_fee
  description?: string;
  created_at: string;
  features: string[]; // Extraído da descrição ou calculado
}

function mapPlanFromDB(planDB: MonetizationPlanDB): MonetizationPlan {
  const platformFee = parseFloat(planDB.platform_fee);
  const artistShare = 1 - platformFee;
  
  // Extrair features baseado no plano
  let features: string[] = [];
  const planName = planDB.name.toLowerCase();
  
  if (planName === 'free') {
    features = [
      'Acesso limitado ao catálogo',
      'Anúncios inclusos',
      `${(artistShare * 100).toFixed(0)}% de receita para o artista`,
      'Pagamentos mensais'
    ];
  } else if (planName === 'premium') {
    features = [
      'Catálogo completo',
      'Sem anúncios',
      `${(artistShare * 100).toFixed(0)}% de receita para o artista`,
      'Pagamentos quinzenais',
      'Analytics básicos'
    ];
  } else if (planName === 'vip') {
    features = [
      'Catálogo completo + extras',
      'Qualidade lossless',
      `${(artistShare * 100).toFixed(0)}% de receita para o artista`,
      'Pagamentos semanais',
      'Analytics avançados',
      'Suporte prioritário'
    ];
  }

  return {
    id: planDB.id,
    name: planDB.name,
    monetization_type: planDB.monetization_type,
    platform_fee: platformFee,
    artist_share: artistShare,
    description: planDB.description || undefined,
    created_at: planDB.created_at,
    features
  };
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('monetization_plans')
      .select('*')
      .order('platform_fee'); // Ordenar pela taxa (menor taxa = melhor plano)

    if (error) throw error;

    const plans = (data || []).map(mapPlanFromDB);

    return NextResponse.json(plans);

  } catch (error) {
    console.error('Erro ao buscar planos de monetização:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar planos de monetização' },
      { status: 500 }
    );
  }
}