// components/ui/ConfirmModal.tsx
'use client';

import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';
import Modal from './Modal';
import type { ConfirmModalProps } from '../../types/modal';

/**
 * Ícones e cores por variante
 */
const variantConfig = {
  default: {
    icon: Info,
    iconColor: 'text-blue-600',
    confirmButtonClass: 'bg-blue-600 hover:bg-blue-700 text-white',
  },
  danger: {
    icon: AlertTriangle,
    iconColor: 'text-red-600',
    confirmButtonClass: 'bg-red-600 hover:bg-red-700 text-white',
  },
  success: {
    icon: CheckCircle,
    iconColor: 'text-green-600',
    confirmButtonClass: 'bg-green-600 hover:bg-green-700 text-white',
  },
  warning: {
    icon: XCircle,
    iconColor: 'text-yellow-600',
    confirmButtonClass: 'bg-yellow-600 hover:bg-yellow-700 text-white',
  },
};

/**
 * Componente ConfirmModal - Modal de confirmação com diferentes variantes
 */
export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'default',
  loading = false,
  icon,
}: ConfirmModalProps) {
  
  const config = variantConfig[variant];
  const IconComponent = icon ? null : config.icon;

  const handleConfirm = () => {
    if (!loading) {
      onConfirm();
    }
  };

  const footer = (
    <div className="flex space-x-3">
      <button
        type="button"
        onClick={onClose}
        disabled={loading}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {cancelText}
      </button>
      
      <button
        type="button"
        onClick={handleConfirm}
        disabled={loading}
        className={`
          px-4 py-2 text-sm font-medium border border-transparent rounded-md
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          disabled:opacity-50 disabled:cursor-not-allowed
          ${config.confirmButtonClass}
          ${loading ? 'cursor-wait' : ''}
        `}
      >
        {loading ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processando...
          </div>
        ) : (
          confirmText
        )}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      variant={variant}
      footer={footer}
      closeOnBackdrop={!loading}
      closeOnEscape={!loading}
    >
      <div className="px-6 py-4">
        <div className="flex items-start">
          {/* Ícone */}
          <div className="flex-shrink-0">
            {icon ? (
              <div className={config.iconColor}>
                {icon}
              </div>
            ) : IconComponent ? (
              <IconComponent className={`size-6 ${config.iconColor}`} />
            ) : null}
          </div>
          
          {/* Mensagem */}
          <div className={`${icon || IconComponent ? 'ml-4' : ''} flex-1`}>
            <p className="text-gray-700 leading-relaxed">
              {message}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}