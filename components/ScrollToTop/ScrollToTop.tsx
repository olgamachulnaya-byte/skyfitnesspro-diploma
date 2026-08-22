"use client";

import styles from "./ScrollToTop.module.css";

export function ScrollToTop() {
  function handleClick() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <button
      type="button"
      className={styles.button}
      onClick={handleClick}
    >
      Наверх ↑
    </button>
  );
}