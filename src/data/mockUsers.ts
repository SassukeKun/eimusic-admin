/**
 * Dados mock de usuários moçambicanos para o sistema administrativo
 * Dados realísticos baseados no contexto de Moçambique
 */

import type { AdminUser } from '@/types/admin';
import type { PaymentMethod } from '@/types/admin';

// Nomes moçambicanos realísticos
const mozambicanNames = [
  'João Macamo', 'Maria Sitoe', 'Carlos Nhongo', 'Ana Chissano',
  'Fernando Matusse', 'Beatriz Mondlane', 'António Muchanga', 'Rosa Cossa',
  'Pedro Massingue', 'Lurdes Machel', 'Eduardo Guebuza', 'Graça Simbine',
  'Armando Manhiça', 'Esperança Bias', 'Joaquim Chissano', 'Paulina Samuel',
  'Venâncio Mondlane', 'Marcelina Chissano', 'Samora Moises', 'Helena Taipo',
  'Alberto Chipande', 'Josina Machel', 'Pascoal Mocumbi', 'Alcinda Abreu',
  'Filipe Nyusi', 'Verónica Macamo', 'Oldemiro Balói', 'Luísa Diogo'
];

// Cidades moçambicanas
const mozambicanCities = [
  'Maputo', 'Beira', 'Nampula', 'Inhambane', 'Tete', 
  'Quelimane', 'Xai-Xai', 'Chimoio', 'Pemba', 'Lichinga'
] as const;

// Provedores de email populares em Moçambique
const emailProviders = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'eimusic.co.mz'];

// Métodos de pagamento populares em Moçambique
const paymentMethods: PaymentMethod[] = ['M-Pesa', 'E-Mola', 'Visa', 'Mastercard', 'Transferência Bancária'];

/**
 * Gerar telefone moçambicano realístico
 */
function generateMozambicanPhone(): string {
  const operators = ['84', '85', '86', '87']; // Operadoras principais
  const operator = operators[Math.floor(Math.random() * operators.length)];
  const number = Math.floor(Math.random() * 9000000) + 1000000; // 7 dígitos
  return `+258 ${operator} ${number.toString().slice(0, 3)} ${number.toString().slice(3)}`;
}

/**
 * Gerar email baseado no nome
 */
function generateEmail(name: string): string {
  const cleanName = name.toLowerCase()
    .replace(/\s+/g, '.')
    .replace(/[^a-z.]/g, '');
  const provider = emailProviders[Math.floor(Math.random() * emailProviders.length)];
  return `${cleanName}@${provider}`;
}

/**
 * Gerar data aleatória nos últimos 2 anos
 */
function generateRandomDate(daysBack: number): string {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date.toISOString();
}

/**
 * Gerar dados de usuário moçambicano realístico
 */
function generateMozambicanUser(index: number): AdminUser {
  const name = mozambicanNames[index % mozambicanNames.length];
  const location = mozambicanCities[Math.floor(Math.random() * mozambicanCities.length)];
  const registeredAt = generateRandomDate(730); // Últimos 2 anos
  const lastActivity = generateRandomDate(30); // Últimos 30 dias
  
  // Status baseado em probabilidades realísticas
  const statusProbability = Math.random();
  const status = statusProbability < 0.7 ? 'active' : 
                statusProbability < 0.85 ? 'inactive' :
                statusProbability < 0.95 ? 'pending' : 'blocked';
  
  // Plano baseado no status
  const planProbability = Math.random();
  const plan = status === 'blocked' ? 'free' :
               planProbability < 0.6 ? 'free' :
               planProbability < 0.85 ? 'premium' : 'vip';
  
  // Gasto baseado no plano e tempo na plataforma
  const monthsActive = Math.floor((Date.now() - new Date(registeredAt).getTime()) / (1000 * 60 * 60 * 24 * 30));
  const baseSpent = plan === 'vip' ? 500 : plan === 'premium' ? 200 : 50;
  const totalSpent = Math.floor(baseSpent * monthsActive * (0.5 + Math.random()));

  return {
    id: `user_${String(index + 1).padStart(3, '0')}`,
    name,
    email: generateEmail(name),
    phone: generateMozambicanPhone(),
    plan,
    status,
    registeredAt,
    lastActivity: status === 'active' ? lastActivity : registeredAt,
    totalSpent,
    location,
    preferredPayment: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
    profileImage: Math.random() > 0.3 ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(/\s+/g, '')}` : undefined,
    isSubscriptionActive: plan !== 'free' && status === 'active',
    subscriptionEndDate: plan !== 'free' ? (() => {
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
      return endDate.toISOString();
    })() : undefined
  };
}

/**
 * Usuários mock moçambicanos (150 usuários)
 */
export const MOCK_USERS: AdminUser[] = Array.from({ length: 150 }, (_, index) => 
  generateMozambicanUser(index)
);

/**
 * Estatísticas calculadas dos usuários
 */
export const USER_STATISTICS = {
  total: MOCK_USERS.length,
  active: MOCK_USERS.filter(u => u.status === 'active').length,
  inactive: MOCK_USERS.filter(u => u.status === 'inactive').length,
  pending: MOCK_USERS.filter(u => u.status === 'pending').length,
  blocked: MOCK_USERS.filter(u => u.status === 'blocked').length,
  premium: MOCK_USERS.filter(u => u.plan === 'premium').length,
  vip: MOCK_USERS.filter(u => u.plan === 'vip').length,
  totalRevenue: MOCK_USERS.reduce((sum, u) => sum + u.totalSpent, 0),
  averageSpent: Math.floor(MOCK_USERS.reduce((sum, u) => sum + u.totalSpent, 0) / MOCK_USERS.length)
};

/**
 * Usuários por cidade (para analytics)
 */
export const USERS_BY_CITY = mozambicanCities.map(city => ({
  city,
  count: MOCK_USERS.filter(u => u.location === city).length,
  revenue: MOCK_USERS.filter(u => u.location === city).reduce((sum, u) => sum + u.totalSpent, 0)
}));

/**
 * Crescimento mensal simulado
 */
export const USER_GROWTH_DATA = Array.from({ length: 12 }, (_, index) => {
  const date = new Date();
  date.setMonth(date.getMonth() - (11 - index));
  
  return {
    month: date.toLocaleDateString('pt-PT', { month: 'short', year: 'numeric' }),
    users: Math.floor(50 + (index * 15) + (Math.random() * 20)),
    revenue: Math.floor(5000 + (index * 2000) + (Math.random() * 3000))
  };
});

/**
 * Filtrar usuários por critérios
 */
export function filterUsers(
  users: AdminUser[],
  filters: {
    searchTerm?: string;
    status?: string;
    plan?: string;
    location?: string;
  }
) {
  return users.filter(user => {
    const matchesSearch = !filters.searchTerm || 
      user.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      user.phone.includes(filters.searchTerm);
    
    const matchesStatus = !filters.status || filters.status === 'all' || user.status === filters.status;
    const matchesPlan = !filters.plan || filters.plan === 'all' || user.plan === filters.plan;
    const matchesLocation = !filters.location || filters.location === 'all' || user.location === filters.location;
    
    return matchesSearch && matchesStatus && matchesPlan && matchesLocation;
  });
}

export default MOCK_USERS;