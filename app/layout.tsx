import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/600.css";

import type { Metadata } from "next";

import { AuthProvider } from "@/context/AuthContext";

import "./globals.css";

export const metadata: Metadata = {
  title: "SkyFitnessPro",
  description: "Онлайн-тренировки SkyFitnessPro",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" data-scroll-behavior="smooth">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}