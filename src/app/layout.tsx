import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Строительная Компания | Строительство домов под ключ",
  description:
    "Профессиональное строительство жилых и коммерческих объектов. 15+ лет опыта, гарантия качества. Получите бесплатную консультацию!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${inter.variable} ${montserrat.variable} antialiased font-sans`}
      >
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
