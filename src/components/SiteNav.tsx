"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./SiteNav.module.css";

const ITEMS = [
  { href: "/", label: "Launches" },
  { href: "/favorites", label: "Favorites" },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <span className={styles.logo}>SpaceX Explorer</span>
      <nav className={styles.nav}>
        {ITEMS.map((item) => {
          const active = pathname === item.href;
          return active ? (
            <span key={item.href} className={styles.active} aria-current="page">
              {item.label}
            </span>
          ) : (
            <Link key={item.href} href={item.href} className={styles.link}>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
