"use client";

import { useFavorites, type Favorite } from "@/lib/favorites-context";

export function FavoriteButton({ launch }: { launch: Favorite }) {
  const { isFavorite, toggle, hydrated } = useFavorites();

  // Avoid rendering stored state until after hydration.
  if (!hydrated) {
    return (
      <button aria-label="Loading favorite state" disabled>
        ☆
      </button>
    );
  }

  const active = isFavorite(launch.id);

  return (
    <button
      onClick={() => toggle(launch)}
      aria-pressed={active}
      aria-label={
        active
          ? `Remove ${launch.name} from favorites`
          : `Add ${launch.name} to favorites`
      }
    >
      {active ? "★" : "☆"}
    </button>
  );
}
