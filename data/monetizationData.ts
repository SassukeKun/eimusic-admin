// data/monetizationData.ts
import { MonetizationPlanInfo, RevenueTransaction } from '@/types/admin';
import type { MonetizationPlan, PaymentMethod, TransactionStatus } from '@/types/modal';

// Tipos estendidos para satisfazer Record<string, unknown>
export type MonetizationPlanRecord = MonetizationPlanInfo & Record<string, unknown>;
export type RevenueTransactionRecord = RevenueTransaction & Record<string, unknown>;

// Dados mockados para os planos de monetização
export const mockPlansData: MonetizationPlanRecord[] = [
  {
    id: '1',
    name: 'Free',
    price: 0,
    subscribers: 32450,
    monthlyRevenue: 0,
    features: [
      'Acesso a conteúdo com anúncios',
      'Qualidade de áudio padrão',
      'Reprodução aleatória',
      'Limite de reproduções diárias',
    ],
    status: 'active',
  },
  {
    id: '2',
    name: 'Premium',
    price: 199, // 199 MT
    subscribers: 8500,
    monthlyRevenue: 1691500, // 1.691.500 MT
    features: [
      'Sem anúncios',
      'Qualidade de áudio alta',
      'Downloads para offline',
      'Reprodução sob demanda',
      'Playlists ilimitadas',
    ],
    status: 'active',
  },
  {
    id: '3',
    name: 'VIP',
    price: 299, // 299 MT
    subscribers: 2200,
    monthlyRevenue: 657800, // 657.800 MT
    features: [
      'Todos os benefícios Premium',
      'Qualidade de áudio lossless',
      'Conteúdo exclusivo',
      'Acesso antecipado a lançamentos',
      'Participação em decisões da plataforma',
      'Badge "Lenda da Música"',
      'Acesso a eventos exclusivos',
    ],
    status: 'active',
  },
];

// Dados mockados para as transações de receita
export const mockTransactionsData: RevenueTransactionRecord[] = [
  {
    id: '1',
    userId: '101',
    userName: 'João Machava',
    userAvatar: 'https://ui-avatars.com/api/?name=Joao+Machava&background=6366f1&color=fff',
    amount: 199,
    type: 'subscription',
    planId: '2',
    planName: 'Premium',
    date: '2023-08-15',
    status: 'completed' as TransactionStatus,
    paymentMethod: 'mpesa' as PaymentMethod,
    phoneNumber: '+258 84 111 2222',
    transactionFee: 1.99, // 1% taxa M-Pesa
  },
  {
    id: '2',
    userId: '102',
    userName: 'Carlos Tembe',
    userAvatar: 'https://ui-avatars.com/api/?name=Carlos+Tembe&background=6366f1&color=fff',
    amount: 299,
    type: 'subscription',
    planId: '3',
    planName: 'VIP',
    date: '2023-08-14',
    status: 'completed' as TransactionStatus,
    paymentMethod: 'visa' as PaymentMethod,
    transactionFee: 7.48, // 2.5% taxa Visa
  },
  {
    id: '3',
    userId: '103',
    userName: 'Eduardo Mondlane',
    userAvatar: 'https://ui-avatars.com/api/?name=Eduardo+Mondlane&background=6366f1&color=fff',
    amount: 199,
    type: 'subscription',
    planId: '2',
    planName: 'Premium',
    date: '2023-08-13',
    status: 'completed' as TransactionStatus,
    paymentMethod: 'mpesa' as PaymentMethod,
    phoneNumber: '+258 85 333 4444',
    transactionFee: 1.99, // 1% taxa M-Pesa
  },
  {
    id: '4',
    userId: '104',
    userName: 'Ana Sitoe',
    userAvatar: 'https://ui-avatars.com/api/?name=Ana+Sitoe&background=6366f1&color=fff',
    amount: -199,
    type: 'refund',
    planId: '2',
    planName: 'Premium',
    date: '2023-08-12',
    status: 'refunded' as TransactionStatus,
    paymentMethod: 'visa' as PaymentMethod,
    transactionFee: -4.98, // 2.5% taxa Visa (reembolsada)
  },
  {
    id: '5',
    userId: '105',
    userName: 'Carlos Mundlovo',
    userAvatar: 'https://ui-avatars.com/api/?name=Carlos+Mundlovo&background=6366f1&color=fff',
    amount: 199,
    type: 'subscription',
    planId: '2',
    planName: 'Premium',
    date: '2023-08-11',
    status: 'pending' as TransactionStatus,
    paymentMethod: 'paypal' as PaymentMethod,
    transactionFee: 5.97, // 3% taxa PayPal
  },
];

// Função auxiliar para calcular estatísticas
export const calculateMonetizationStats = (plans: MonetizationPlanRecord[]) => {
  const totalSubscribers = plans.reduce((total, plan) => total + plan.subscribers, 0);
  const totalMonthlyRevenue = plans.reduce((total, plan) => total + plan.monthlyRevenue, 0);
  const paidSubscribers = plans
    .filter(plan => plan.price > 0)
    .reduce((total, plan) => total + plan.subscribers, 0);
  
  const conversionRate = totalSubscribers > 0 
    ? (paidSubscribers / totalSubscribers) * 100 
    : 0;
  
  return {
    totalSubscribers,
    paidSubscribers,
    conversionRate,
    totalMonthlyRevenue,
    // Supondo um crescimento mensal de 8.5%
    growth: 8.5,
  };
};