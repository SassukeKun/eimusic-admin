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
  // Novos usuários fictícios
  {
    id: '6',
    name: 'Isabel Novela',
    email: 'isabel.novela@gmail.com',
    avatar: 'https://ui-avatars.com/api/?name=Isabel+Novela&background=6366f1&color=fff',
    plan: 'premium' as MonetizationPlan,
    joinedDate: '2023-09-12',
    lastActive: '2024-01-30',
    totalSpent: 1850,
    status: 'active' as ArtistStatus,
    paymentMethod: 'mpesa' as PaymentMethod,
    phoneNumber: '+258 85 789 0123',
    lastPaymentDate: '2024-02-01',
    subscriptionStatus: 'active' as UserStatus,
  },
  {
    id: '7',
    name: 'Pedro Matsinha',
    email: 'pedro.matsinha@outlook.com',
    avatar: 'https://ui-avatars.com/api/?name=Pedro+Matsinha&background=6366f1&color=fff',
    plan: 'basic' as MonetizationPlan,
    joinedDate: '2023-10-05',
    lastActive: '2024-02-10',
    totalSpent: 0,
    status: 'active' as ArtistStatus,
    subscriptionStatus: 'active' as UserStatus,
  },
  {
    id: '8',
    name: 'Sónia Chirindza',
    email: 'sonia.chirindza@gmail.com',
    avatar: 'https://ui-avatars.com/api/?name=Sonia+Chirindza&background=6366f1&color=fff',
    plan: 'premium' as MonetizationPlan,
    joinedDate: '2023-08-22',
    lastActive: '2024-02-08',
    totalSpent: 2120,
    status: 'active' as ArtistStatus,
    paymentMethod: 'visa' as PaymentMethod,
    lastPaymentDate: '2024-01-22',
    subscriptionStatus: 'active' as UserStatus,
  },
  {
    id: '9',
    name: 'Fernando Manhiça',
    email: 'fernando.manhica@hotmail.com',
    avatar: 'https://ui-avatars.com/api/?name=Fernando+Manhica&background=6366f1&color=fff',
    plan: 'enterprise' as MonetizationPlan,
    joinedDate: '2023-07-18',
    lastActive: '2024-02-12',
    totalSpent: 5100,
    status: 'active' as ArtistStatus,
    paymentMethod: 'paypal' as PaymentMethod,
    lastPaymentDate: '2024-02-01',
    subscriptionStatus: 'active' as UserStatus,
  },
  {
    id: '10',
    name: 'Márcia Guambe',
    email: 'marcia.guambe@gmail.com',
    avatar: 'https://ui-avatars.com/api/?name=Marcia+Guambe&background=6366f1&color=fff',
    plan: 'basic' as MonetizationPlan,
    joinedDate: '2023-11-10',
    lastActive: '2024-01-15',
    totalSpent: 0,
    status: 'inactive' as ArtistStatus,
    subscriptionStatus: 'expired' as UserStatus,
  },
  {
    id: '11',
    name: 'Ricardo Mabjaia',
    email: 'ricardo.mabjaia@gmail.com',
    avatar: 'https://ui-avatars.com/api/?name=Ricardo+Mabjaia&background=6366f1&color=fff',
    plan: 'premium' as MonetizationPlan,
    joinedDate: '2023-06-28',
    lastActive: '2024-02-07',
    totalSpent: 2850,
    status: 'active' as ArtistStatus,
    paymentMethod: 'mpesa' as PaymentMethod,
    phoneNumber: '+258 86 345 6789',
    lastPaymentDate: '2024-01-28',
    subscriptionStatus: 'active' as UserStatus,
  },
  {
    id: '12',
    name: 'Ana Chissano',
    email: 'ana.chissano@outlook.com',
    avatar: 'https://ui-avatars.com/api/?name=Ana+Chissano&background=6366f1&color=fff',
    plan: 'premium' as MonetizationPlan,
    joinedDate: '2023-10-20',
    lastActive: '2024-02-05',
    totalSpent: 1980,
    status: 'active' as ArtistStatus,
    paymentMethod: 'visa' as PaymentMethod,
    lastPaymentDate: '2024-01-20',
    subscriptionStatus: 'active' as UserStatus,
  },
  {
    id: '13',
    name: 'Paulo Simbine',
    email: 'paulo.simbine@gmail.com',
    avatar: 'https://ui-avatars.com/api/?name=Paulo+Simbine&background=6366f1&color=fff',
    plan: 'basic' as MonetizationPlan,
    joinedDate: '2023-12-05',
    lastActive: '2024-01-25',
    totalSpent: 0,
    status: 'active' as ArtistStatus,
    subscriptionStatus: 'active' as UserStatus,
  },
  {
    id: '14',
    name: 'Carla Mazive',
    email: 'carla.mazive@hotmail.com',
    avatar: 'https://ui-avatars.com/api/?name=Carla+Mazive&background=6366f1&color=fff',
    plan: 'enterprise' as MonetizationPlan,
    joinedDate: '2023-09-30',
    lastActive: '2024-02-11',
    totalSpent: 4750,
    status: 'active' as ArtistStatus,
    paymentMethod: 'paypal' as PaymentMethod,
    lastPaymentDate: '2024-02-03',
    subscriptionStatus: 'active' as UserStatus,
  },
  {
    id: '15',
    name: 'Miguel Chongo',
    email: 'miguel.chongo@gmail.com',
    avatar: 'https://ui-avatars.com/api/?name=Miguel+Chongo&background=6366f1&color=fff',
    plan: 'premium' as MonetizationPlan,
    joinedDate: '2023-08-15',
    lastActive: '2024-02-01',
    totalSpent: 2350,
    status: 'suspended' as ArtistStatus,
    paymentMethod: 'mpesa' as PaymentMethod,
    phoneNumber: '+258 84 987 6543',
    lastPaymentDate: '2023-12-15',
    subscriptionStatus: 'cancelled' as UserStatus,
  },
  {
    id: '16',
    name: 'Teresa Nuvunga',
    email: 'teresa.nuvunga@outlook.com',
    avatar: 'https://ui-avatars.com/api/?name=Teresa+Nuvunga&background=6366f1&color=fff',
    plan: 'basic' as MonetizationPlan,
    joinedDate: '2023-11-22',
    lastActive: '2024-01-05',
    totalSpent: 0,
    status: 'active' as ArtistStatus,
    subscriptionStatus: 'active' as UserStatus,
  },
  {
    id: '17',
    name: 'Alberto Macamo',
    email: 'alberto.macamo@gmail.com',
    avatar: 'https://ui-avatars.com/api/?name=Alberto+Macamo&background=6366f1&color=fff',
    plan: 'premium' as MonetizationPlan,
    joinedDate: '2023-07-10',
    lastActive: '2024-02-09',
    totalSpent: 2720,
    status: 'active' as ArtistStatus,
    paymentMethod: 'visa' as PaymentMethod,
    lastPaymentDate: '2024-01-10',
    subscriptionStatus: 'active' as UserStatus,
  },
  {
    id: '18',
    name: 'Célia Nhantumbo',
    email: 'celia.nhantumbo@hotmail.com',
    avatar: 'https://ui-avatars.com/api/?name=Celia+Nhantumbo&background=6366f1&color=fff',
    plan: 'enterprise' as MonetizationPlan,
    joinedDate: '2023-09-08',
    lastActive: '2024-02-07',
    totalSpent: 5320,
    status: 'active' as ArtistStatus,
    paymentMethod: 'paypal' as PaymentMethod,
    lastPaymentDate: '2024-02-05',
    subscriptionStatus: 'active' as UserStatus,
  },
  {
    id: '19',
    name: 'Filipe Djedje',
    email: 'filipe.djedje@gmail.com',
    avatar: 'https://ui-avatars.com/api/?name=Filipe+Djedje&background=6366f1&color=fff',
    plan: 'basic' as MonetizationPlan,
    joinedDate: '2023-12-15',
    lastActive: '2024-01-20',
    totalSpent: 0,
    status: 'active' as ArtistStatus,
    subscriptionStatus: 'active' as UserStatus,
  },
  {
    id: '20',
    name: 'Raquel Massingue',
    email: 'raquel.massingue@outlook.com',
    avatar: 'https://ui-avatars.com/api/?name=Raquel+Massingue&background=6366f1&color=fff',
    plan: 'premium' as MonetizationPlan,
    joinedDate: '2023-10-10',
    lastActive: '2024-02-03',
    totalSpent: 2150,
    status: 'active' as ArtistStatus,
    paymentMethod: 'mpesa' as PaymentMethod,
    phoneNumber: '+258 87 123 4567',
    lastPaymentDate: '2024-01-10',
    subscriptionStatus: 'active' as UserStatus,
  }
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