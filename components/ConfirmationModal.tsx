import React from 'react';
import { Icon } from './Icon';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  icon?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  isDestructive = false,
  isLoading = false,
  icon,
}) => {
  if (!isOpen) return null;

  const defaultIcon = isDestructive ? 'warning' : 'info';
  const displayIcon = icon || defaultIcon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in-up" 
        onClick={!isLoading ? onClose : undefined}
      ></div>

      {/* Modal Content */}
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl relative z-10 animate-scale-in border border-gray-100">
        <div className={`size-14 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-sm ${isDestructive ? 'bg-red-50 text-red-500' : 'bg-primary/10 text-primary'}`}>
          <Icon name={displayIcon} className="text-3xl" filled />
        </div>
        
        <h3 className="text-xl font-bold text-center text-text-main mb-2">{title}</h3>
        
        <p className="text-center text-text-secondary text-sm mb-6 leading-relaxed">
          {message}
        </p>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={onConfirm}
            disabled={isLoading}
            className={`w-full text-white font-bold py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${
              isDestructive 
                ? 'bg-red-600 hover:bg-red-700 shadow-red-500/25' 
                : 'bg-primary hover:bg-primary-dark shadow-primary/25'
            } ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-95'}`}
          >
            {isLoading && <Icon name="sync" className="animate-spin" />}
            {confirmLabel}
          </button>
          
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="w-full bg-transparent text-text-secondary font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
};