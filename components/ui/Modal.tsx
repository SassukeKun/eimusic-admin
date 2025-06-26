// components/ui/Modal.tsx
'use client';

import { useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { ModalProps } from '../../types/modal';

/**
 * Configurações de tamanho do modal
 */
const modalSizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4',
};

/**
 * Configurações de posição do modal
 */
const modalPositions = {
  center: 'items-center justify-center',
  top: 'items-start justify-center pt-16',
  bottom: 'items-end justify-center pb-16',
};

/**
 * Configurações de variant (cores do header)
 */
const modalVariants = {
  default: 'bg-white text-gray-900',
  danger: 'bg-white text-gray-900 border-t-4 border-red-500',
  success: 'bg-white text-gray-900 border-t-4 border-green-500',
  warning: 'bg-white text-gray-900 border-t-4 border-yellow-500',
};

/**
 * Animações para o modal
 */
const backdropAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2, ease: 'easeOut' as const }
};

const modalAnimation = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 20 },
  transition: { duration: 0.2, ease: 'easeOut' as const }
};

/**
 * Hook para gerenciar efeitos colaterais do modal
 */
function useModalEffects(
  isOpen: boolean,
  onClose: () => void,
  closeOnEscape: boolean,
  preventScroll: boolean
) {
  const originalOverflow = useRef<string>('');

  // Gerenciar scroll do body
  useEffect(() => {
    if (isOpen && preventScroll) {
      originalOverflow.current = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }

    return () => {
      if (preventScroll) {
        document.body.style.overflow = originalOverflow.current;
      }
    };
  }, [isOpen, preventScroll]);

  // Gerenciar tecla ESC
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);
}

/**
 * Hook para gerenciar foco
 */
function useFocusManagement(isOpen: boolean) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Salvar elemento focado antes do modal
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Focar no modal após abrir
      setTimeout(() => {
        if (modalRef.current) {
          const firstFocusable = modalRef.current.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) as HTMLElement;
          
          if (firstFocusable) {
            firstFocusable.focus();
          } else {
            modalRef.current.focus();
          }
        }
      }, 100);
    }

    return () => {
      // Restaurar foco ao fechar
      if (!isOpen && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen]);

  return modalRef;
}

/**
 * Componente Modal - Modal base reutilizável
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  position = 'center',
  variant = 'default',
  className = '',
  children,
  closeOnBackdrop = true,
  closeOnEscape = true,
  preventScroll = true,
  showCloseButton = true,
  hideHeader = false,
  hideFooter = false,
  footer,
  onOpen,
  onClosed,
}: ModalProps) {
  
  const modalRef = useFocusManagement(isOpen);
  
  useModalEffects(isOpen, onClose, closeOnEscape, preventScroll);

  // Handler para click no backdrop
  const handleBackdropClick = useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget && closeOnBackdrop) {
      onClose();
    }
  }, [onClose, closeOnBackdrop]);

  // Callbacks de ciclo de vida
  useEffect(() => {
    if (isOpen) {
      onOpen?.();
    } else {
      onClosed?.();
    }
  }, [isOpen, onOpen, onClosed]);

  // Trap focus dentro do modal
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;

      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  }, [modalRef]);

  if (!isOpen) return null;

  const modalElement = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            variants={backdropAnimation}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={handleBackdropClick}
          />

          {/* Modal container */}
          <div 
            className={`fixed inset-0 overflow-y-auto ${modalPositions[position]}`}
            onClick={handleBackdropClick}
          >
            <motion.div
              ref={modalRef}
              className={`
                relative w-full ${modalSizes[size]} mx-auto my-8
                ${modalVariants[variant]}
                rounded-lg shadow-xl
                ${className}
              `}
              variants={modalAnimation}
              initial="initial"
              animate="animate"
              exit="exit"
              onKeyDown={handleKeyDown}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? `${title}-title` : undefined}
              aria-describedby={description ? `${description}-desc` : undefined}
              tabIndex={-1}
            >
              {/* Header */}
              {!hideHeader && (title || showCloseButton) && (
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div>
                    {title && (
                      <h2 
                        id={`${title}-title`}
                        className="text-xl font-semibold text-gray-900"
                      >
                        {title}
                      </h2>
                    )}
                    {description && (
                      <p 
                        id={`${description}-desc`}
                        className="mt-1 text-sm text-gray-500"
                      >
                        {description}
                      </p>
                    )}
                  </div>
                  
                  {showCloseButton && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
                      aria-label="Fechar modal"
                    >
                      <X className="size-5" />
                    </button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className={`${hideHeader ? 'pt-6' : ''} ${hideFooter && !footer ? 'pb-6' : ''}`}>
                {children}
              </div>

              {/* Footer */}
              {!hideFooter && footer && (
                <div className="flex items-center justify-end px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );

  // Renderizar via portal se estiver no browser
  if (typeof document !== 'undefined') {
    return createPortal(modalElement, document.body);
  }

  return modalElement;
}