// components/admin/AlertBanner.tsx
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

type AlertType = 'info' | 'warning' | 'success' | 'error';

interface AlertBannerProps {
  type: AlertType;
  title: string;
  message?: string;
  onDismiss?: () => void;
}

export default function AlertBanner({ type, title, message, onDismiss }: AlertBannerProps) {
  // Definir as cores e ícones com base no tipo
  const config = {
    info: {
      icon: <Info className="h-5 w-5 text-blue-400" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-300'
    },
    warning: {
      icon: <AlertTriangle className="h-5 w-5 text-yellow-400" />,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-300'
    },
    success: {
      icon: <CheckCircle className="h-5 w-5 text-green-400" />,
      bgColor: 'bg-green-50',
      textColor: 'text-green-800',
      borderColor: 'border-green-300'
    },
    error: {
      icon: <XCircle className="h-5 w-5 text-red-400" />,
      bgColor: 'bg-red-50',
      textColor: 'text-red-800',
      borderColor: 'border-red-300'
    }
  };

  const { icon, bgColor, textColor, borderColor } = config[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${bgColor} ${textColor} p-4 rounded-md border ${borderColor} mb-6`}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium">{title}</h3>
          {message && <div className="mt-1 text-sm">{message}</div>}
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <button
              onClick={onDismiss}
              className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${textColor}`}
            >
              <span className="sr-only">Fechar</span>
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}