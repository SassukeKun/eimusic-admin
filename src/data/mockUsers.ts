/**
 * Dados mock de usuários moçambicanos para o EiMusic Admin
 * Todos os dados são realísticos e representativos de Moçambique
 */

import { v4 as uuidv4 } from 'uuid';
import type { AdminUser, UserFilters } from '@/types/admin';
import { 
  MOZAMBICAN_CITIES,
  MOZAMBICAN_MALE_NAMES,
  MOZAMBICAN_FEMALE_NAMES, 
  MOZAMBICAN_SURNAMES,
  USER_STATUS,
  USER_PLANS,
  PAYMENT_METHODS
} from './constants';

// Função auxiliar para gerar nomes moçambicanos realísticos
function generateMozambicanName(): string {
  const isMale = Math.random() > 0.5;
  const firstName = isMale 
    ? MOZAMBICAN_MALE_NAMES[Math.floor(Math.random() * MOZAMBICAN_MALE_NAMES.length)]
    : MOZAMBICAN_FEMALE_NAMES[Math.floor(Math.random() * MOZAMBICAN_FEMALE_NAMES.length)];
  const surname = MOZAMBICAN_SURNAMES[Math.floor(Math.random() * MOZAMBICAN_SURNAMES.length)];
  return `${firstName} ${surname}`;
}

// Função auxiliar para gerar email baseado no nome
function generateEmail(name: string): string {
  const cleanName = name.toLowerCase()
    .replace(/\s+/g, '.')
    .replace(/[áàãâ]/g, 'a')
    .replace(/[éèê]/g, 'e')
    .replace(/[íì]/g, 'i')
    .replace(/[óòõô]/g, 'o')
    .replace(/[úù]/g, 'u')
    .replace(/ç/g, 'c');
  
  const domains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  
  return `${cleanName}@${domain}`;
}

// Função auxiliar para gerar telefone moçambicano
function generateMozambicanPhone(): string {
  const prefixes = ['84', '85', '86', '87'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = Math.floor(1000000 + Math.random() * 9000000);
  return `+258 ${prefix} ${number}`;
}

// Função auxiliar para gerar data aleatória
function generateRandomDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString();
}

// Gerar dados mock de usuários
function generateMockUsers(count: number): AdminUser[] {
  return Array.from({ length: count }, () => {
    const name = generateMozambicanName();
    const registeredDaysAgo = Math.floor(Math.random() * 365);
    const lastActivityDaysAgo = Math.floor(Math.random() * 30);
    const plan = Object.values(USER_PLANS)[Math.floor(Math.random() * Object.values(USER_PLANS).length)];
    
    // Usuários premium/vip têm maior probabilidade de serem ativos
    const isActive = plan !== 'free' ? Math.random() > 0.1 : Math.random() > 0.3;
    const status = isActive 
      ? (Math.random() > 0.95 ? USER_STATUS.PENDING : USER_STATUS.ACTIVE)
      : (Math.random() > 0.7 ? USER_STATUS.BLOCKED : USER_STATUS.ACTIVE);

    // Gasto total baseado no plano
    let totalSpent = 0;
    if (plan === 'premium') {
      totalSpent = Math.floor(200 + Math.random() * 800); // 200-1000 MT
    } else if (plan === 'vip') {
      totalSpent = Math.floor(500 + Math.random() * 1500); // 500-2000 MT
    } else {
      totalSpent = Math.floor(Math.random() * 200); // 0-200 MT para free
    }

    const isSubscriptionActive = plan !== 'free' && status === 'active' && Math.random() > 0.2;

    return {
      id: uuidv4(),
      name,
      email: generateEmail(name),
      phone: generateMozambicanPhone(),
      plan,
      status,
      registeredAt: generateRandomDate(registeredDaysAgo),
      lastActivity: generateRandomDate(lastActivityDaysAgo),
      totalSpent,
      location: MOZAMBICAN_CITIES[Math.floor(Math.random() * MOZAMBICAN_CITIES.length)],
      preferredPayment: PAYMENT_METHODS[Math.floor(Math.random() * PAYMENT_METHODS.length)],
      isSubscriptionActive,
      subscriptionEndDate: isSubscriptionActive 
        ? new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
        : undefined,
      profileImage: Math.random() > 0.7 
        ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
        : undefined
    };
  });
}

// Dados mock - 150 usuários para simulação realística
export const MOCK_USERS: AdminUser[] = generateMockUsers(150);

// Função para filtrar usuários (simula busca)
export function filterUsers(users: AdminUser[], filters: UserFilters): AdminUser[] {
  return users.filter(user => {
    // Filtro por status
    if (filters.status && user.status !== filters.status) {
      return false;
    }

    // Filtro por plano
    if (filters.plan && user.plan !== filters.plan) {
      return false;
    }

    // Filtro por localização
    if (filters.location && user.location !== filters.location) {
      return false;
    }

    // Busca por termo (nome ou email)
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      const matchesName = user.name.toLowerCase().includes(term);
      const matchesEmail = user.email.toLowerCase().includes(term);
      if (!matchesName && !matchesEmail) {
        return false;
      }
    }

    // Filtro por data
    if (filters.dateFrom) {
      const userDate = new Date(user.registeredAt);
      const fromDate = new Date(filters.dateFrom);
      if (userDate < fromDate) {
        return false;
      }
    }

    if (filters.dateTo) {
      const userDate = new Date(user.registeredAt);
      const toDate = new Date(filters.dateTo);
      if (userDate > toDate) {
        return false;
      }
    }

    return true;
  });
}

// Estatísticas dos usuários para dashboard
export function getUserStats(users: AdminUser[]) {
  const activeUsers = users.filter(u => u.status === 'active').length;
  const premiumUsers = users.filter(u => u.plan === 'premium').length;
  const vipUsers = users.filter(u => u.plan === 'vip').length;
  const totalRevenue = users.reduce((sum, u) => sum + u.totalSpent, 0);
  
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);
  const newUsersThisMonth = users.filter(u => new Date(u.registeredAt) >= last30Days).length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const activeToday = users.filter(u => new Date(u.lastActivity) >= today).length;

  return {
    total: users.length,
    active: activeUsers,
    premium: premiumUsers,
    vip: vipUsers,
    totalRevenue,
    newThisMonth: newUsersThisMonth,
    activeToday
  };
}