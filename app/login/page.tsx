"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";

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
    setMode((currentMode) =>
      currentMode === "login" ? "register" : "login",
    );

    setErrorMessage("");
  }

  return (
    <main>
      <h1>{mode === "login" ? "Вход" : "Регистрация"}</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>

          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            placeholder="Email"
          />
        </div>

        <div>
          <label htmlFor="password">Пароль</label>

          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            placeholder="Пароль"
          />
        </div>

        {errorMessage && <p>{errorMessage}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Загрузка..."
            : mode === "login"
              ? "Войти"
              : "Зарегистрироваться"}
        </button>
      </form>

      <button type="button" onClick={changeMode} disabled={isSubmitting}>
        {mode === "login"
          ? "Зарегистрироваться"
          : "Уже есть аккаунт? Войти"}
      </button>
    </main>
  );
}