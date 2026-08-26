"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useState, type FormEvent, type MouseEvent } from "react";

import { useAuth } from "@/hooks/useAuth";

import styles from "./AuthModal.module.css";

type AuthMode = "login" | "register";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateRegistrationPassword(password: string): string | null {
  if (password.length < 6) {
    return "Пароль должен содержать не менее 6 символов";
  }

  const specialCharacters = password.match(/[^A-Za-z0-9]/g) ?? [];

  if (specialCharacters.length < 2) {
    return "Пароль должен содержать не менее 2 спецсимволов";
  }

  if (!/[A-Z]/.test(password)) {
    return "Пароль должен содержать как минимум одну заглавную букву";
  }

  return null;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Произошла неизвестная ошибка";
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, register } = useAuth();

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");

    const normalizedEmail = email.trim();

    if (!validateEmail(normalizedEmail)) {
      setErrorMessage("Введите корректный Email");
      return;
    }

    if (!password) {
      setErrorMessage("Введите пароль");
      return;
    }

    if (mode === "register" && password !== repeatPassword) {
      setErrorMessage("Пароли не совпадают");
      return;
    }

    if (mode === "register") {
      const passwordError = validateRegistrationPassword(password);

      if (passwordError) {
        setErrorMessage(passwordError);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const credentials = {
        email: normalizedEmail,
        password,
      };

      if (mode === "login") {
        await login(credentials);
      } else {
        await register(credentials);
      }

      onClose();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  function changeMode() {
    setMode((currentMode) => (currentMode === "login" ? "register" : "login"));

    setPassword("");
    setRepeatPassword("");
    setErrorMessage("");
  }

  function handleOverlayClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget && !isSubmitting) {
      onClose();
    }
  }

  return createPortal(
    <div
      className={styles.overlay}
      onMouseDown={handleOverlayClick}
      role="presentation"
    >
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label={
          mode === "login" ? "Вход в аккаунт" : "Регистрация аккаунта"
        }
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          disabled={isSubmitting}
          aria-label="Закрыть окно"
        >
          ×
        </button>

        <Image
          src="/figma/logo.svg"
          alt="SkyFitnessPro"
          width={223}
          height={36}
          className={styles.logo}
          priority
        />

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputs}>
            <input
              id="modal-email"
              name="email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="Эл. почта"
            />

            <input
              id="modal-password"
              name="password"
              type="password"
              className={styles.input}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              placeholder="Пароль"
            />

            {mode === "register" && (
              <input
                id="modal-repeat-password"
                name="repeatPassword"
                type="password"
                className={styles.input}
                value={repeatPassword}
                onChange={(event) => setRepeatPassword(event.target.value)}
                autoComplete="new-password"
                placeholder="Повторите пароль"
              />
            )}
          </div>

          {errorMessage && <p className={styles.error}>{errorMessage}</p>}

          <div className={styles.buttons}>
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Загрузка..."
                : mode === "login"
                  ? "Войти"
                  : "Зарегистрироваться"}
            </button>

            <button
              type="button"
              className={styles.secondaryButton}
              onClick={changeMode}
              disabled={isSubmitting}
            >
              {mode === "login" ? "Зарегистрироваться" : "Войти"}
            </button>
          </div>
        </form>
      </section>
    </div>,
    document.body,
  );
}
