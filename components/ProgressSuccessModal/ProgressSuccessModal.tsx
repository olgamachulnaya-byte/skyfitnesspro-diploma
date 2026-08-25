"use client";

import { useEffect } from "react";

import styles from "./ProgressSuccessModal.module.css";

type ProgressSuccessModalProps = {
  onClose: () => void;
};

export function ProgressSuccessModal({ onClose }: ProgressSuccessModalProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className={styles.backdrop} role="presentation" onMouseDown={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2 className={styles.title}>Ваш прогресс засчитан!</h2>

        <div className={styles.check} aria-hidden="true">
          ✓
        </div>

        <button type="button" className={styles.button} onClick={onClose}>
          Продолжить
        </button>
      </div>
    </div>
  );
}
