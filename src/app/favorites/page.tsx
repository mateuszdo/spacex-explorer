"use client";

import Link from "next/link";
import { useFavorites } from "@/lib/hooks/useFavorites";
import styles from "./page.module.css";

export default function FavoritesPage() {
  const { favorites, toggle, hydrated } = useFavorites();

  return (
    <>
      <Link href="/" className={styles.back}>
        ← Back to launches
      </Link>

      <h1>Favorites</h1>

      {!hydrated && <p className={styles.empty}>Loading…</p>}

      {hydrated && favorites.length === 0 && (
        <p className={styles.empty}>
          No favorites yet. Bookmark a launch to see it here.
        </p>
      )}

      {hydrated && favorites.length > 0 && (
        <ul className={styles.list}>
          {favorites.map((fav) => (
            <li key={fav.id} className={styles.item}>
              <Link href={`/launches/${fav.id}`}>{fav.name}</Link>
              <button
                onClick={() => toggle(fav)}
                aria-label={`Remove ${fav.name} from favorites`}
                className={styles.button}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
