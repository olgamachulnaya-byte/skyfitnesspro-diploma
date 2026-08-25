import { CourseCatalog } from "@/components/CourseCatalog/CourseCatalog";
import { Header } from "@/components/Header/Header";
import { ScrollToTop } from "@/components/ScrollToTop/ScrollToTop";

import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <CourseCatalog />
        <ScrollToTop />
      </main>
    </div>
  );
}
