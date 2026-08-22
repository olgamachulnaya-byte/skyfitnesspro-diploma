"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";

import styles from "./Header.module.css";

export function Header() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          <img
            src="/figma/logo.png"
            alt="SkyFitnessPro"
            className={styles.logo}
          />

          <span className={styles.subtitle}>
            Онлайн-тренировки для занятий дома
          </span>
        </Link>

        {!isLoading &&
          (isAuthenticated && user ? (
            <div className={styles.user}>
              <Link href="/profile" className={styles.profileLink}>
                {user.email}
              </Link>

              <button
                type="button"
                className={styles.authButton}
                onClick={handleLogout}
              >
                Выйти
              </button>
            </div>
          ) : (
            <Link href="/login" className={styles.authButton}>
              Войти
            </Link>
          ))}
      </div>
    </header>
  );
}