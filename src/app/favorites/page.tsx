"use client";

import Link from "next/link";
import { useFavorites } from "@/lib/hooks/useFavorites";

export default function FavoritesPage() {
  const { favorites, toggle, hydrated } = useFavorites();

  return (
    <main>
      <p>
        <Link href="/">← Back to launches</Link>
      </p>

      <h1>Favorites</h1>

      {!hydrated && <p>Loading…</p>}

      {hydrated && favorites.length === 0 && (
        <p>No favorites yet. Bookmark a launch to see it here.</p>
      )}

      {hydrated && favorites.length > 0 && (
        <ul>
          {favorites.map((fav) => (
            <li key={fav.id}>
              <Link href={`/launches/${fav.id}`}>{fav.name}</Link>
              <button
                onClick={() => toggle(fav)}
                aria-label={`Remove ${fav.name} from favorites`}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
