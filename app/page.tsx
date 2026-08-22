import { CourseCatalog } from "@/components/CourseCatalog/CourseCatalog";
import { Header } from "@/components/Header/Header";
import { ScrollToTop } from "@/components/ScrollToTop/ScrollToTop";

export default function HomePage() {
  return (
    <main>
      <Header />
      <CourseCatalog />
      <ScrollToTop />
    </main>
  );
}