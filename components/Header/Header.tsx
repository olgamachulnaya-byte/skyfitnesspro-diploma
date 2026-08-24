"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useAuth } from "@/hooks/useAuth";

import styles from "./Header.module.css";

export function Header() {
  const router = useRouter();

  const {
    user,
    isLoading,
    isAuthenticated,
    logout,
  } = useAuth();

  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  const menuRef =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleMouseDown(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsMenuOpen(false);
      }
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleMouseDown,
    );

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleMouseDown,
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, []);

  function handleLogout() {
    logout();
    setIsMenuOpen(false);
    router.push("/");
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link
          href="/"
          className={styles.brand}
        >
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
            <div
              ref={menuRef}
              className={styles.userWrapper}
            >
              <button
                type="button"
                className={styles.user}
                aria-expanded={isMenuOpen}
                aria-haspopup="menu"
                onClick={() =>
                  setIsMenuOpen(
                    (currentValue) =>
                      !currentValue,
                  )
                }
              >
                <span
                  className={styles.userAvatar}
                >
                  {user.email
                    .charAt(0)
                    .toUpperCase()}
                </span>

                <span
                  className={styles.userName}
                >
                  {user.email.split("@")[0]}
                </span>

                <span
                  className={`${styles.chevron} ${
                    isMenuOpen
                      ? styles.chevronOpen
                      : ""
                  }`}
                  aria-hidden="true"
                >
                  ˅
                </span>
              </button>

              {isMenuOpen && (
                <div
                  className={styles.userMenu}
                  role="menu"
                >
                  <p
                    className={
                      styles.menuEmail
                    }
                  >
                    {user.email}
                  </p>

                  <Link
                    href="/profile"
                    className={styles.menuLink}
                    role="menuitem"
                    onClick={() =>
                      setIsMenuOpen(false)
                    }
                  >
                    Мой профиль
                  </Link>

                  <button
                    type="button"
                    className={
                      styles.logoutButton
                    }
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    Выйти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className={styles.authButton}
            >
              Войти
            </Link>
          ))}
      </div>
    </header>
  );
}