// data/selectOptions.ts
/**
 * Opções para componentes Select baseadas nos dados existentes do projeto
 * Usando APENAS os dados da documentação oficial
 */

import type { SelectOption } from '../types/form';
import type { MonetizationPlan, PaymentMethod, ArtistStatus } from '../types/modal';

/**
 * Gêneros musicais baseados nos artistas existentes
 */
export const genreOptions: SelectOption[] = [
  { value: 'pandza', label: 'Pandza' },
  { value: 'marrabenta', label: 'Marrabenta' },
  { value: 'hip-hop', label: 'Hip Hop' },
  { value: 'pop', label: 'Pop' },
  { value: 'kizomba', label: 'Kizomba' },
  { value: 'afro-pop', label: 'Afro-Pop' },
  { value: 'rnb', label: 'R&B' },
];

/**
 * Status de artistas (baseado nos tipos existentes)
 */
export const artistStatusOptions: SelectOption<ArtistStatus>[] = [
  { value: 'active', label: 'Ativo' },
  { value: 'inactive', label: 'Inativo' },
  { value: 'suspended', label: 'Suspenso' },
];

/**
 * Planos de monetização (EXATO da documentação)
 */
export const monetizationPlanOptions: SelectOption<MonetizationPlan>[] = [
  { value: 'basic', label: 'Básico (0 MT)' },
  { value: 'premium', label: 'Premium (120 MT/mês)' },
  { value: 'enterprise', label: 'Enterprise (250 MT/mês)' },
];

/**
 * Métodos de pagamento (EXATO da documentação de monetização)
 */
export const paymentMethodOptions: SelectOption<PaymentMethod>[] = [
  // Pagamentos Locais Moçambicanos
  { value: 'mpesa', label: 'M-Pesa (1% taxa)', group: 'Mobile Money' },
  
  // Pagamentos Internacionais  
  { value: 'visa', label: 'Visa/Mastercard (2.5% taxa)', group: 'Cartões' },
  { value: 'paypal', label: 'PayPal (3% taxa)', group: 'Internacional' },
];

/**
 * Status de conteúdo (baseado nos tracks existentes)
 */
export const contentStatusOptions: SelectOption<'draft' | 'published' | 'removed'>[] = [
  { value: 'draft', label: 'Rascunho' },
  { value: 'published', label: 'Publicado' },
  { value: 'removed', label: 'Removido' },
];

/**
 * Planos de usuário (baseado na documentação)
 */
export const userPlanOptions: SelectOption<'free' | 'premium' | 'vip'>[] = [
  { value: 'free', label: 'Gratuito' },
  { value: 'premium', label: 'Premium' },
  { value: 'vip', label: 'VIP' },
];

/**
 * Status de usuário
 */
export const userStatusOptions: SelectOption<ArtistStatus>[] = [
  { value: 'active', label: 'Ativo' },
  { value: 'inactive', label: 'Inativo' },
  { value: 'suspended', label: 'Suspenso' },
];

/**
 * Valores de micro-doações (EXATO da documentação)
 */
export const donationValueOptions: SelectOption<string>[] = [
  { value: '5', label: '5 MT - "Gostei! 👍"' },
  { value: '15', label: '15 MT - "Muito bom! 🔥"' },
  { value: '30', label: '30 MT - "Excelente! ⭐"' },
  { value: '50', label: '50 MT - "Fã número 1! 👑"' },
  { value: '100', label: '100 MT - "Apoio total! 💎"' },
];

/**
 * Status de transações de pagamento
 */
export const paymentStatusOptions: SelectOption<'completed' | 'pending' | 'failed' | 'refunded'>[] = [
  { value: 'completed', label: 'Concluído' },
  { value: 'pending', label: 'Pendente' },
  { value: 'failed', label: 'Falhado' },
  { value: 'refunded', label: 'Reembolsado' },
];

/**
 * Artistas existentes para seleção
 */
export const artistOptions: SelectOption<string>[] = [
  { value: '1', label: 'Lizha James' },
  { value: '2', label: 'MC Roger' },
  { value: '3', label: 'Valter Artístico' },
  { value: '4', label: 'Marllen' },
  { value: '5', label: 'Ziqo' },
];

/**
 * Função para carregar artistas de forma assíncrona (simulando API)
 */
export const loadArtistsAsync = async (query: string): Promise<SelectOption<string>[]> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (!query) return artistOptions;
  
  return artistOptions.filter(artist =>
    artist.label.toLowerCase().includes(query.toLowerCase())
  );
};