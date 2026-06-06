import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useSignOut() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  return useCallback(async () => {
    try {
      await qc.cancelQueries();
      qc.clear();
      await supabase.auth.signOut();
      toast.success("Signed out");
      navigate({ to: "/auth", search: { mode: "signin", role: "student" }, replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sign out failed";
      toast.error(msg);
    }
  }, [navigate, qc]);
}
