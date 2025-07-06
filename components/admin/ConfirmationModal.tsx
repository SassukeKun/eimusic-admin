// components/admin/ConfirmationModal.tsx
'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import Button from './Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger';
  type?: 'default' | 'danger' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
  onClose?: () => void;
  loading?: boolean;
}

/**
 * COMPONENTE CONFIRMATION MODAL - Modal de confirmação reutilizável
 * 
 * Funcionalidades:
 * 1. Diferentes tipos visuais (default, danger, warning)
 * 2. Textos customizáveis
 * 3. Estados de loading
 * 4. Acessibilidade completa
 * 5. Escape key e backdrop click
 */
export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmVariant = 'primary',
  type = 'default',
  onConfirm,
  onCancel,
  onClose,
  loading = false,
}: ConfirmationModalProps) {
  
  // Handler para tecla ESC
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !loading) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, loading, onCancel]);

  // Handler para click no backdrop
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget && !loading) {
      onCancel();
    }
  };

  // Determinar ícone e cores baseado no tipo
  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          iconColor: 'text-red-600',
          iconBg: 'bg-red-100',
          titleColor: 'text-red-900',
        };
      case 'warning':
        return {
          iconColor: 'text-yellow-600',
          iconBg: 'bg-yellow-100',
          titleColor: 'text-yellow-900',
        };
      default:
        return {
          iconColor: 'text-blue-600',
          iconBg: 'bg-blue-100',
          titleColor: 'text-gray-900',
        };
    }
  };

  const typeStyles = getTypeStyles();

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start">
            {/* Ícone */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-full ${typeStyles.iconBg} flex items-center justify-center mr-4`}>
              <AlertTriangle className={`w-5 h-5 ${typeStyles.iconColor}`} />
            </div>
            
            {/* Conteúdo */}
            <div className="flex-1 min-w-0">
              <h3 
                id="modal-title"
                className={`text-lg font-medium ${typeStyles.titleColor} mb-2`}
              >
                {title}
              </h3>
              <p 
                id="modal-description"
                className="text-sm text-gray-600 leading-relaxed"
              >
                {message}
              </p>
            </div>

            {/* Botão fechar (opcional) */}
            {onClose && (
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                aria-label="Fechar modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Footer com botões */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex items-center justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="min-w-[80px]"
          >
            {cancelText}
          </Button>
          
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            loading={loading}
            disabled={loading}
            className="min-w-[80px]"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}