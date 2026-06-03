"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export interface Favorite {
  id: string;
  name: string;
}

const STORAGE_KEY = "spacex:favorites";

interface FavoritesContextValue {
  favorites: Favorite[];
  toggle: (fav: Favorite) => void;
  isFavorite: (id: string) => boolean;
  hydrated: boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Read once after mount — localStorage is client-only.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setFavorites(JSON.parse(raw) as Favorite[]);
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  const toggle = useCallback((fav: Favorite) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === fav.id);
      const next = exists
        ? prev.filter((f) => f.id !== fav.id)
        : [...prev, fav];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore write failures
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.some((f) => f.id === id),
    [favorites],
  );

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggle, isFavorite, hydrated }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return ctx;
}
