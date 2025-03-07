import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase-client";
import { Session } from "@supabase/supabase-js";

type SupabaseContextType = {
  session: Session | null;
  isLoading: boolean;
};

const SupabaseContext = createContext<SupabaseContextType>({
  session: null,
  isLoading: true,
});

export function useSupabase() {
  return useContext(SupabaseContext);
}

interface SupabaseProviderProps {
  children: ReactNode;
}

export function SupabaseProvider({ children }: SupabaseProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    session,
    isLoading,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}
