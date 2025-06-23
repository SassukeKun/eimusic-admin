export const MOZAMBICAN_CITIES = [
  'Maputo',
  'Beira',
  'Nampula', 
  'Inhambane',
  'Tete',
  'Quelimane',
  'Xai-Xai',
  'Chimoio',
  'Pemba',
  'Lichinga',
  'Mocuba',
  'Gurué',
  'Nacala',
  'Angoche',
  'Montepuez'
] as const;

// Gêneros musicais populares em Moçambique
export const MOZAMBICAN_MUSIC_GENRES = [
  'Marrabenta',
  'Pandza', 
  'Amapiano',
  'Hip Hop',
  'R&B',
  'Afrobeat',
  'Jazz & Soul',
  'Kizomba',
  'Zouk',
  'Gospel',
  'Afro House',
  'Dancehall',
  'Reggae',
  'Traditional'
] as const;

// Nomes típicos moçambicanos (masculinos)
export const MOZAMBICAN_MALE_NAMES = [
  'João Carlos',
  'António Manuel',
  'Pedro José',
  'Carlos Alberto',
  'Manuel Francisco',
  'José Maria',
  'Francisco Xavier',
  'Alberto Joaquim',
  'Joaquim António',
  'Eduardo Manuel',
  'Armando José',
  'Benedito Carlos',
  'Domingos António',
  'Filipe Manuel',
  'Hélder José'
] as const;

// Nomes típicos moçambicanos (femininos)  
export const MOZAMBICAN_FEMALE_NAMES = [
  'Ana Paula',
  'Maria dos Anjos',
  'Beatriz',
  'Rosa Maria',
  'Cristina Isabel',
  'Lurdes António',
  'Palmira José',
  'Esperança Manuel',
  'Graça Francisco',
  'Isabel Maria',
  'Julieta Carlos',
  'Lúcia António',
  'Marcelina José',
  'Nércia Manuel',
  'Otília Francisco'
] as const;

// Sobrenomes comuns em Moçambique
export const MOZAMBICAN_SURNAMES = [
  'Mucavel',
  'Manhiça', 
  'Sitoe',
  'Mondlane',
  'Nhamirre',
  'Cossa',
  'Macamo',
  'Chissano',
  'Guebuza',
  'Nyusi',
  'Machel',
  'Simango',
  'Dhlakama',
  'Momade',
  'Ossufo',
  'Muianga',
  'Chapo',
  'Matsombe',
  'Massinga',
  'Nhaca'
] as const;

// Nomes artísticos moçambicanos inspirados em artistas reais
export const MOZAMBICAN_ARTIST_NAMES = [
  'Zena Bakar',
  'MC Joaquim',
  'DJ Azagaia Jr',
  'Maria dos Anjos',
  'Lenna Bahule',
  'Kelvin Momo Moz',
  'Stewart Sukuma',
  'Anita Macuácua',
  'Denny OG Moz',
  'Lizha James Jr',
  'Hélio Bahule',
  'Mingas Moz',
  'Edmazia Mayembe',
  'Ghorwane New',
  'Mariza Moz'
] as const;

// Status possíveis no sistema
export const USER_STATUS = {
  ACTIVE: 'active',
  BLOCKED: 'blocked', 
  PENDING: 'pending'
} as const;

export const ARTIST_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  VERIFIED: 'verified',
  BLOCKED: 'blocked'
} as const;

export const CONTENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  FEATURED: 'featured',
  BLOCKED: 'blocked'
} as const;

// Planos de usuário
export const USER_PLANS = {
  FREE: 'free',
  PREMIUM: 'premium', 
  VIP: 'vip'
} as const;

// Métodos de pagamento em Moçambique
export const PAYMENT_METHODS = [
  'M-Pesa',
  'e-Mola',
  'Mkesh',
  'Cartão Bancário',
  'Transferência Bancária'
] as const;

// Cores para status (seguindo design system)
export const STATUS_COLORS = {
  approved: {
    text: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20'
  },
  pending: {
    text: 'text-yellow-400', 
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20'
  },
  blocked: {
    text: 'text-red-400',
    bg: 'bg-red-500/10', 
    border: 'border-red-500/20'
  },
  verified: {
    text: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20'
  },
  active: {
    text: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20'
  },
  featured: {
    text: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20'
  }
} as const;

export type MozambicanCity = typeof MOZAMBICAN_CITIES[number];
export type MozambicanGenre = typeof MOZAMBICAN_MUSIC_GENRES[number];
export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];
export type ArtistStatus = typeof ARTIST_STATUS[keyof typeof ARTIST_STATUS];
export type ContentStatus = typeof CONTENT_STATUS[keyof typeof CONTENT_STATUS];
export type UserPlan = typeof USER_PLANS[keyof typeof USER_PLANS];
export type PaymentMethod = typeof PAYMENT_METHODS[number];