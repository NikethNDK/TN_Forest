import { useState, useCallback } from 'react';

interface ConfirmationOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

interface ConfirmationState extends ConfirmationOptions {
  isOpen: boolean;
  onConfirm: (() => void) | null;
}

export const useConfirmation = () => {
  const [state, setState] = useState<ConfirmationState>({
    isOpen: false,
    message: '',
    onConfirm: null
  });

  const confirm = useCallback((
    options: ConfirmationOptions,
    onConfirm: () => void | Promise<void>
  ) => {
    setState({
      isOpen: true,
      title: options.title || 'Confirm Action',
      message: options.message,
      confirmText: options.confirmText,
      cancelText: options.cancelText,
      variant: options.variant || 'danger',
      onConfirm: async () => {
        await onConfirm();
        setState(prev => ({ ...prev, isOpen: false, onConfirm: null }));
      }
    });
  }, []);

  const close = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false, onConfirm: null }));
  }, []);

  return {
    isOpen: state.isOpen,
    title: state.title,
    message: state.message,
    confirmText: state.confirmText,
    cancelText: state.cancelText,
    variant: state.variant,
    onConfirm: state.onConfirm || (() => {}),
    confirm,
    close
  };
};

