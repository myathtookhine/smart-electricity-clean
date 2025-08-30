import React from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  Circle,
  Zap 
} from 'lucide-react';

const alertVariants = {
  success: {
    container: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    icon: 'text-green-600 dark:text-green-400',
    title: 'text-green-800 dark:text-green-300',
    message: 'text-green-700 dark:text-green-400'
  },
  danger: {
    container: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    icon: 'text-red-600 dark:text-red-400',
    title: 'text-red-800 dark:text-red-300',
    message: 'text-red-700 dark:text-red-400'
  },
  warning: {
    container: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    icon: 'text-yellow-600 dark:text-yellow-400',
    title: 'text-yellow-800 dark:text-yellow-300',
    message: 'text-yellow-700 dark:text-yellow-400'
  },
  info: {
    container: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    icon: 'text-blue-600 dark:text-blue-400',
    title: 'text-blue-800 dark:text-blue-300',
    message: 'text-blue-700 dark:text-blue-400'
  },
  neutral: {
    container: 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800',
    icon: 'text-gray-600 dark:text-gray-400',
    title: 'text-gray-800 dark:text-gray-300',
    message: 'text-gray-700 dark:text-gray-400'
  }
};

const defaultIcons = {
  success: CheckCircle,
  danger: XCircle,
  warning: AlertTriangle,
  info: Info,
  neutral: Circle
};

export function Alert({ 
  type = 'neutral', 
  title, 
  message, 
  showIcon = true, 
  showMessage = true,
  customIcon: CustomIcon,
  className = '',
  ...props 
}) {
  const variant = alertVariants[type] || alertVariants.neutral;
  const IconComponent = CustomIcon || defaultIcons[type];

  return (
    <div 
      className={`
        flex items-start space-x-3 p-4 rounded-lg border 
        ${variant.container} 
        ${className}
      `}
      {...props}
    >
      {showIcon && IconComponent && (
        <div className="flex-shrink-0 mt-0.5">
          <IconComponent className={`w-5 h-5 ${variant.icon}`} />
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        {title && (
          <h3 className={`text-sm font-medium ${variant.title}`}>
            {title}
          </h3>
        )}
        
        {showMessage && message && (
          <p className={`text-sm mt-1 ${variant.message}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

// Export individual alert variants for convenience
export const SuccessAlert = (props) => <Alert type="success" {...props} />;
export const DangerAlert = (props) => <Alert type="danger" {...props} />;
export const WarningAlert = (props) => <Alert type="warning" {...props} />;
export const InfoAlert = (props) => <Alert type="info" {...props} />;
export const NeutralAlert = (props) => <Alert type="neutral" {...props} />;
