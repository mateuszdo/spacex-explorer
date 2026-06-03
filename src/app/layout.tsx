import type { Metadata } from "next";
import { Providers } from "./providers";
import { SiteNav } from "@/components/SiteNav";
import styles from "./layout.module.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpaceX Explorer",
  description: "Browse SpaceX launches.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>
          <SiteNav />
          <main className={styles.main}>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
