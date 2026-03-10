import React, { useState, useCallback } from 'react';
import { ConfirmModal } from '@/shared/components/modals/ConfirmModal';

interface ConfirmOptions {
  title: string;
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  error?: string | null;
}

export const useConfirmModal = () => {
  const [current, setCurrent] = useState<ConfirmOptions | null>(null);
  const [visible, setVisible] = useState(false);

  const showConfirm = useCallback((options: ConfirmOptions) => {
    setCurrent(options);
    setVisible(true);
  }, []);

  const hideConfirm = useCallback(() => {
    setVisible(false);
  }, []);

  const ConfirmModalRenderer = useCallback(() => {
    if (!current) {
      return null;
    }

    return (
      <ConfirmModal
        visible={visible}
        title={current.title}
        message={current.message}
        confirmText={current.confirmText}
        cancelText={current.cancelText}
        loading={current.loading}
        error={current.error ?? null}
        onCancel={hideConfirm}
        onConfirm={() => {
          current.onConfirm();
        }}
      />
    );
  }, [current, visible, hideConfirm]);

  return { showConfirm, ConfirmModal: ConfirmModalRenderer };
};
