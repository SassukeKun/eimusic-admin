// data/usersData.ts
import { User } from '@/types/admin';

// Tipo estendido para satisfazer Record<string, unknown>
export type UserRecord = User & Record<string, unknown>;

// Dados mockados para usuários
export const mockUsersData: UserRecord[] = [
  {
    id: '1',
    name: 'João Machava',
    email: 'joao.machava@gmail.com',
    avatar: 'https://ui-avatars.com/api/?name=Joao+Machava&background=6366f1&color=fff',
    plan: 'premium',
    joinedDate: '2023-05-20',
    lastActive: '2023-08-15',
    totalSpent: 2500, // 2500 MT
    status: 'active',
  },
  {
    id: '2',
    name: 'Luísa Cossa',
    email: 'luisa.cossa@outlook.com',
    avatar: 'https://ui-avatars.com/api/?name=Luisa+Cossa&background=6366f1&color=fff',
    plan: 'free',
    joinedDate: '2023-06-15',
    lastActive: '2023-08-16',
    totalSpent: 0,
    status: 'active',
  },
  {
    id: '3',
    name: 'Carlos Tembe',
    email: 'carlos.tembe@gmail.com',
    avatar: 'https://ui-avatars.com/api/?name=Carlos+Tembe&background=6366f1&color=fff',
    plan: 'premium',
    joinedDate: '2023-04-10',
    lastActive: '2023-07-30',
    totalSpent: 3500, // 3500 MT
    status: 'active',
  },
  {
    id: '4',
    name: 'Fátima Sitoe',
    email: 'fatima.sitoe@hotmail.com',
    avatar: 'https://ui-avatars.com/api/?name=Fatima+Sitoe&background=6366f1&color=fff',
    plan: 'free',
    joinedDate: '2023-07-01',
    lastActive: '2023-07-25',
    totalSpent: 0,
    status: 'inactive',
  },
  {
    id: '5',
    name: 'António Mundlovo',
    email: 'antonio.mundlovo@gmail.com',
    avatar: 'https://ui-avatars.com/api/?name=Antonio+Mundlovo&background=6366f1&color=fff',
    plan: 'premium',
    joinedDate: '2023-03-15',
    lastActive: '2023-08-17',
    totalSpent: 4200, // 4200 MT
    status: 'active',
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