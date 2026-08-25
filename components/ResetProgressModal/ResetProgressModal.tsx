"use client";

import styles from "./ResetProgressModal.module.css";

type ResetProgressModalProps = {
  isResetting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ResetProgressModal({
  isResetting,
  onClose,
  onConfirm,
}: ResetProgressModalProps) {
  return (
    <div className={styles.backdrop} role="presentation" onMouseDown={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <p className={styles.text}>Вы уверены, что хотите сбросить прогресс?</p>

        <div className={styles.buttons}>
          <button
            type="button"
            className={styles.cancelButton}
            disabled={isResetting}
            onClick={onClose}
          >
            Нет
          </button>

          <button
            type="button"
            className={styles.confirmButton}
            disabled={isResetting}
            onClick={onConfirm}
          >
            {isResetting ? "Сброс..." : "Сбросить"}
          </button>
        </div>
      </div>
    </div>
  );
}
