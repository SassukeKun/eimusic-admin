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
export type MonetizationPlan = 'basic' | 'premium' | 'enterprise';

// Métodos de pagamento disponíveis
export type PaymentMethod = 'mpesa' | 'visa' | 'paypal';

// Status de artista
export type ArtistStatus = 'active' | 'inactive' | 'suspended';

// Status de usuário
export type UserStatus = 'active' | 'expired' | 'cancelled';

// Status de transação
export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'refunded';

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

// Interface para dados do formulário de artista
export interface ArtistFormData {
  readonly id?: string;
  readonly name: string;
  readonly email: string;
  readonly bio: string;
  readonly genre: string;
  readonly monetizationPlan: MonetizationPlan;
  readonly paymentMethod: PaymentMethod;
  readonly phoneNumber?: string;
  readonly verified: boolean;
  readonly isActive: boolean;
  readonly receiveNotifications: boolean;
  readonly allowPublicProfile: boolean;
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

// Interface para dados do formulário de usuário
export interface UserFormData {
  readonly id?: string;
  readonly name: string;
  readonly email: string;
  readonly plan: MonetizationPlan;
  readonly paymentMethod?: PaymentMethod;
  readonly phoneNumber?: string;
  readonly isActive: boolean;
  readonly receiveNotifications: boolean;
  readonly status?: UserStatus;
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