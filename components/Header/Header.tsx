"use client";

import Image from "next/image";
import Link from "next/link";

import { useAuth } from "@/hooks/useAuth";

import styles from "./Header.module.css";

export function Header() {
  const { user, isLoading, isAuthenticated } = useAuth();


  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          <Image
            src="/figma/logo.png"
            alt="SkyFitnessPro"
            width={220}
            height={35}
            className={styles.logo}
            priority
          />

          <span className={styles.subtitle}>
            Онлайн-тренировки для занятий дома
          </span>
        </Link>

         {!isLoading &&
  (isAuthenticated && user ? (
    <Link href="/profile" className={styles.user}>
      <span className={styles.userAvatar}>
        {user.email.charAt(0).toUpperCase()}
      </span>

      <span className={styles.userName}>
        {user.email.split("@")[0]}
      </span>

      <span className={styles.chevron} aria-hidden="true">
        ˅
      </span>
    </Link>
  ) : (
    <Link href="/login" className={styles.authButton}>
      Войти
    </Link>
  ))}
      </div>
    </header>
  );
}