"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { useAuth } from "@/hooks/useAuth";

import styles from "./page.module.css";

type AuthMode = "login" | "register";

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

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuth();

  const [mode, setMode] = useState<AuthMode>("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

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

      router.push("/profile");
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

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <Link href="/" className={styles.logoLink}>
          <Image
            src="/figma/logo.svg"
            alt="SkyFitnessPro"
            width={223}
            height={36}
            className={styles.logo}
            priority
          />
        </Link>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputs}>
            <input
              id="email"
              name="email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="Эл. почта"
            />

            <input
              id="password"
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
                id="repeatPassword"
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
    </main>
  );
}
