// data/usersData.ts
import { User } from '@/types/admin';
import type { MonetizationPlan, PaymentMethod, ArtistStatus, UserStatus } from '@/types/modal';

// Tipo estendido para satisfazer Record<string, unknown>
export type UserRecord = User & Record<string, unknown>;

// Dados mockados para usuários - ATUALIZADOS com campos de pagamento
export const mockUsersData: UserRecord[] = [
  {
    id: '1',
    name: 'João Machava',
    email: 'joao.machava@gmail.com',
    avatar: 'https://ui-avatars.com/api/?name=Joao+Machava&background=6366f1&color=fff',
    plan: 'premium' as MonetizationPlan,
    joinedDate: '2023-05-20',
    lastActive: '2023-08-15',
    totalSpent: 2500, // 2500 MT
    status: 'active' as ArtistStatus,
    // CAMPOS DE PAGAMENTO
    paymentMethod: 'mpesa' as PaymentMethod,
    phoneNumber: '+258 84 111 2222',
    lastPaymentDate: '2024-01-15',
    subscriptionStatus: 'active' as UserStatus,
  },
  {
    id: '2',
    name: 'Luísa Cossa',
    email: 'luisa.cossa@outlook.com',
    avatar: 'https://ui-avatars.com/api/?name=Luisa+Cossa&background=6366f1&color=fff',
    plan: 'basic' as MonetizationPlan,
    joinedDate: '2023-06-15',
    lastActive: '2023-08-16',
    totalSpent: 0,
    status: 'active' as ArtistStatus,
    // CAMPOS DE PAGAMENTO (usuário free não tem)
    subscriptionStatus: 'active' as UserStatus, // free plan
  },
  {
    id: '3',
    name: 'Carlos Tembe',
    email: 'carlos.tembe@gmail.com',
    avatar: 'https://ui-avatars.com/api/?name=Carlos+Tembe&background=6366f1&color=fff',
    plan: 'premium' as MonetizationPlan,
    joinedDate: '2023-04-10',
    lastActive: '2023-07-30',
    totalSpent: 3500, // 3500 MT
    status: 'active' as ArtistStatus,
    // CAMPOS DE PAGAMENTO
    paymentMethod: 'visa' as PaymentMethod,
    lastPaymentDate: '2024-01-20',
    subscriptionStatus: 'active' as UserStatus,
  },
  {
    id: '4',
    name: 'Fátima Sitoe',
    email: 'fatima.sitoe@hotmail.com',
    avatar: 'https://ui-avatars.com/api/?name=Fatima+Sitoe&background=6366f1&color=fff',
    plan: 'basic' as MonetizationPlan,
    joinedDate: '2023-07-01',
    lastActive: '2023-07-25',
    totalSpent: 0,
    status: 'inactive' as ArtistStatus,
    // CAMPOS DE PAGAMENTO (usuário free não tem)
    subscriptionStatus: 'expired' as UserStatus, // inativo
  },
  {
    id: '5',
    name: 'António Mundlovo',
    email: 'antonio.mundlovo@gmail.com',
    avatar: 'https://ui-avatars.com/api/?name=Antonio+Mundlovo&background=6366f1&color=fff',
    plan: 'enterprise' as MonetizationPlan,
    joinedDate: '2023-03-15',
    lastActive: '2023-08-17',
    totalSpent: 4200, // 4200 MT
    status: 'active' as ArtistStatus,
    // CAMPOS DE PAGAMENTO
    paymentMethod: 'paypal' as PaymentMethod,
    lastPaymentDate: '2024-01-25',
    subscriptionStatus: 'active' as UserStatus,
  },
];

// Função para filtrar usuários com base em critérios
export const filterUsers = (
  users: UserRecord[],
  filters: Record<string, string>,
  searchQuery: string
): UserRecord[] => {
  let result = [...users];
  
  // Aplicar filtros
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      result = result.filter(user => String(user[key]) === value);
    }
  });
  
  // Aplicar pesquisa
  if (searchQuery) {
    const lowerQuery = searchQuery.toLowerCase();
    result = result.filter(user => 
      user.name.toString().toLowerCase().includes(lowerQuery) || 
      user.email.toString().toLowerCase().includes(lowerQuery)
    );
  }
  
  return result;
};