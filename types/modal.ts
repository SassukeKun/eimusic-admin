/**
 * Modal System Types
 * Interfaces e tipos para o sistema de modais
 */

// Tamanhos disponíveis para modais
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

// Posições do modal na tela
export type ModalPosition = 'center' | 'top' | 'bottom';

// Tipos de modal para diferentes casos de uso
export type ModalVariant = 'default' | 'danger' | 'success' | 'warning';

// Planos de monetização disponíveis
export type MonetizationPlan = 'free' | 'basic' | 'premium' | 'pro';

// Métodos de pagamento disponíveis
export type PaymentMethod = 'mpesa' | 'bank_transfer' | 'card' | 'cash';

// Status de artista
export type ArtistStatus = 'active' | 'pending' | 'inactive';

// Status de usuário
export type UserStatus = 'active' | 'pending' | 'banned';

// Status de transação
export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'refunded';

// Status de conteúdo (faixas, álbuns, vídeos)
export type ContentStatus = 'published' | 'draft' | 'removed';

// Interface base para todos os modais
export interface BaseModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly title?: string;
  readonly description?: string;
  readonly size?: ModalSize;
  readonly position?: ModalPosition;
  readonly variant?: ModalVariant;
  readonly className?: string;
  readonly children: React.ReactNode;
  
  // Configurações de comportamento
  readonly closeOnBackdrop?: boolean;
  readonly closeOnEscape?: boolean;
  readonly preventScroll?: boolean;
  readonly showCloseButton?: boolean;
  
  // Callbacks
  readonly onOpen?: () => void;
  readonly onClosed?: () => void;
}

// Props do Modal base
export interface ModalProps extends BaseModalProps {
  readonly hideHeader?: boolean;
  readonly hideFooter?: boolean;
  readonly footer?: React.ReactNode;
}

// Props do Modal de confirmação
export interface ConfirmModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
  readonly title: string;
  readonly message: string;
  readonly confirmText?: string;
  readonly cancelText?: string;
  readonly variant?: ModalVariant;
  readonly loading?: boolean;
  readonly icon?: React.ReactNode;
}

// Props do Modal de edição de artista
export interface EditArtistModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSave: (data: ArtistFormData) => void;
  readonly artist?: ArtistFormData;
  readonly loading?: boolean;
  readonly mode?: 'create' | 'edit';
}

/**
 * Dados do formulário de artista
 */
export interface ArtistFormData {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  genre?: string;
  country?: string;
  city?: string;
  status: 'active' | 'pending' | 'inactive';
  avatarFile?: File;
  bannerFile?: File;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    youtube?: string;
    spotify?: string;
    website?: string;
  };
}

// Props do Modal de edição de usuário
export interface EditUserModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSave: (data: UserFormData) => void;
  readonly user?: UserFormData;
  readonly loading?: boolean;
  readonly mode?: 'create' | 'edit';
}

/**
 * Dados do formulário de usuário
 */
export interface UserFormData {
  name: string;
  email: string;
  role: 'admin' | 'artist' | 'user';
  status: 'active' | 'pending' | 'banned';
  country?: string;
  city?: string;
  phone?: string;
  avatarFile?: File;
}

// Props do Modal de edição de álbum
export interface EditAlbumModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSave: (data: AlbumFormData) => void;
  readonly album?: AlbumFormData;
  readonly loading?: boolean;
  readonly mode?: 'create' | 'edit';
}

/**
 * Dados do formulário de álbum
 */
export interface AlbumFormData {
  title: string;
  artistId: string;
  trackCount?: number;
  totalDuration?: number;
  releaseDate?: string;
  status: 'published' | 'draft' | 'removed';
  coverFile?: File;
}

// Props do Modal de edição de vídeo
export interface EditVideoModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSave: (data: VideoFormData) => void;
  readonly video?: VideoFormData;
  readonly loading?: boolean;
  readonly mode?: 'create' | 'edit';
}

/**
 * Dados do formulário de vídeo
 */
export interface VideoFormData {
  title: string;
  artistId: string;
  duration: number;
  status: 'published' | 'draft' | 'removed';
  videoFile?: File;
  thumbnailFile?: File;
}

/**
 * Dados do formulário de faixa
 */
export interface TrackFormData {
  title: string;
  artistId: string;
  albumId?: string;
  duration: number;
  releaseDate?: string;
  status: 'published' | 'draft' | 'removed';
  coverFile?: File;
  audioFile?: File;
  genre?: string;
  isrc?: string;
  lyrics?: string;
}

// Context do sistema de modal
export interface ModalContextValue {
  readonly openModals: readonly string[];
  readonly openModal: (id: string) => void;
  readonly closeModal: (id: string) => void;
  readonly isModalOpen: (id: string) => boolean;
}

// Props do provider de modal
export interface ModalProviderProps {
  readonly children: React.ReactNode;
}

