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
      <Link href="/" className={styles.logo}>
        SkyFitnessPro
      </Link>

      <div className={styles.actions}>
        {!isLoading &&
          (isAuthenticated && user ? (
            <>
              <Link href="/profile" className={styles.profileLink}>
                {user.email}
              </Link>

              <button
                type="button"
                className={styles.button}
                onClick={handleLogout}
              >
                Выйти
              </button>
            </>
          ) : (
            <Link href="/login" className={styles.button}>
              Войти
            </Link>
          ))}
      </div>
    </header>
  );
}