// data/analyticsData.ts

// Interfaces para dados de analytics
export interface AnalyticsPeriod {
  readonly totalUsers: number;
  readonly newUsers: number;
  readonly totalArtists: number;
  readonly newArtists: number;
  readonly totalPlays: number;
  readonly totalRevenue: number;
}

export interface MonthlyData {
  readonly month: string;
  readonly users: number;
  readonly artists: number;
  readonly plays: number;
  readonly revenue: number;
}

export interface AnalyticsData {
  readonly currentPeriod: AnalyticsPeriod;
  readonly previousPeriod: AnalyticsPeriod;
  readonly monthlyData: MonthlyData[];
}

export interface StatsCard {
  readonly title: string;
  readonly value: number;
  readonly change: number;
  readonly icon: string;
  readonly prefix?: string;
}

// Dados mockados para estatísticas de analytics
export const mockAnalyticsData: AnalyticsData = {
  currentPeriod: {
    totalUsers: 45850,
    newUsers: 1250,
    totalArtists: 1300,
    newArtists: 75,
    totalPlays: 1250000,
    totalRevenue: 2766000, // 2.766.000 MT
  },
  previousPeriod: {
    totalUsers: 43500,
    newUsers: 1100,
    totalArtists: 1180,
    newArtists: 62,
    totalPlays: 1150000,
    totalRevenue: 2450000, // 2.450.000 MT
  },
  // Dados para gráficos mensais (últimos 6 meses)
  monthlyData: [
    { month: 'Mar', users: 40200, artists: 1050, plays: 980000, revenue: 2100000 },
    { month: 'Abr', users: 41500, artists: 1090, plays: 1050000, revenue: 2250000 },
    { month: 'Mai', users: 42800, artists: 1120, plays: 1100000, revenue: 2350000 },
    { month: 'Jun', users: 43500, artists: 1180, plays: 1150000, revenue: 2450000 },
    { month: 'Jul', users: 44700, artists: 1240, plays: 1200000, revenue: 2600000 },
    { month: 'Ago', users: 45850, artists: 1300, plays: 1250000, revenue: 2766000 },
  ],
};

// Função para calcular mudanças percentuais
export const calculateChange = (current: number, previous: number): number => {
  if (previous === 0) return 100;
  return ((current - previous) / previous) * 100;
};

// Função para gerar estatísticas para os cards
export const generateStatsCards = (): StatsCard[] => {
  const { currentPeriod, previousPeriod } = mockAnalyticsData;
  
  return [
    {
      title: 'Total de Usuários',
      value: currentPeriod.totalUsers,
      change: calculateChange(
        currentPeriod.totalUsers,
        previousPeriod.totalUsers
      ),
      icon: 'Users',
    },
    {
      title: 'Novos Usuários',
      value: currentPeriod.newUsers,
      change: calculateChange(
        currentPeriod.newUsers,
        previousPeriod.newUsers
      ),
      icon: 'Users',
    },
    {
      title: 'Total de Artistas',
      value: currentPeriod.totalArtists,
      change: calculateChange(
        currentPeriod.totalArtists,
        previousPeriod.totalArtists
      ),
      icon: 'Music',
    },
    {
      title: 'Total de Reproduções',
      value: currentPeriod.totalPlays,
      change: calculateChange(
        currentPeriod.totalPlays,
        previousPeriod.totalPlays
      ),
      icon: 'PlayCircle',
    },
    {
      title: 'Receita Total',
      value: currentPeriod.totalRevenue,
      change: calculateChange(
        currentPeriod.totalRevenue,
        previousPeriod.totalRevenue
      ),
      icon: 'DollarSign',
      prefix: 'MT ',
    },
  ];
};