import { useEffect, useMemo, useState } from "react";

type UseTrainerAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useTrainerAuth(options?: UseTrainerAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = "/trainer-login" } =
    options ?? {};
  
  const [trainer, setTrainer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if trainer session exists in localStorage
    const session = localStorage.getItem('trainerSession');
    if (session) {
      try {
        setTrainer(JSON.parse(session));
      } catch (e) {
        console.error('Failed to parse trainer session:', e);
        setTrainer(null);
      }
    }
    setLoading(false);
  }, []);

  const state = useMemo(() => {
    return {
      user: trainer,
      loading,
      error: null,
      isAuthenticated: Boolean(trainer),
    };
  }, [trainer, loading]);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (loading) return;
    if (state.user) return;
    if (typeof window === "undefined") return;
    if (window.location.pathname === redirectPath) return;

    window.location.href = redirectPath;
  }, [
    redirectOnUnauthenticated,
    redirectPath,
    loading,
    state.user,
  ]);

  return {
    ...state,
    refresh: () => {
      const session = localStorage.getItem('trainerSession');
      if (session) {
        try {
          setTrainer(JSON.parse(session));
        } catch (e) {
          console.error('Failed to parse trainer session:', e);
          setTrainer(null);
        }
      }
    },
    logout: () => {
      localStorage.removeItem('trainerSession');
      setTrainer(null);
      window.location.href = '/trainer-login';
    },
  };
}
