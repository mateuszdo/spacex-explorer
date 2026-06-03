"use client";

import { useEffect, useState, useCallback } from "react";

export interface Favorite {
  id: string;
  name: string;
}

const STORAGE_KEY = "spacex:favorites";

function read(): Favorite[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Favorite[]) : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Read from storage only after mount - localStorage is client-only.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFavorites(read());
    setHydrated(true);
  }, []);

  // Sync across tabs/components.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) setFavorites(read());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = useCallback((next: Favorite[]) => {
    setFavorites(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const toggle = useCallback((fav: Favorite) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === fav.id);
      const next = exists
        ? prev.filter((f) => f.id !== fav.id)
        : [...prev, fav];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.some((f) => f.id === id),
    [favorites],
  );

  return { favorites, toggle, isFavorite, hydrated, persist };
}
