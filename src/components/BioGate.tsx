import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, User } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

type Profile = {
  display_name: string | null;
  phone: string | null;
  location: string | null;
};

export function BioGate({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [needsBio, setNeedsBio] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (cancelled) return;
      if (!auth.user) {
        navigate({ to: "/auth", search: { mode: "signin", role: "student" }, replace: true });
        return;
      }
      setUserId(auth.user.id);
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, phone, location")
        .eq("user_id", auth.user.id)
        .maybeSingle<Profile>();
      if (cancelled) return;
      const p = profile ?? { display_name: null, phone: null, location: null };
      setDisplayName(p.display_name ?? "");
      setPhone(p.phone ?? "");
      setLocation(p.location ?? "");
      const missing = !p.display_name || !p.phone || !p.location;
      setNeedsBio(missing);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const saveBio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    if (!displayName.trim() || !phone.trim() || !location.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName.trim(),
          phone: phone.trim(),
          location: location.trim(),
        })
        .eq("user_id", userId);
      if (error) throw error;
      toast.success("Profile saved");
      setNeedsBio(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Couldn't save";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-foreground/50" />
      </div>
    );
  }

  return (
    <>
      {children}
      {needsBio && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur flex items-center justify-center p-4">
          <form
            onSubmit={saveBio}
            className="card-soft w-full max-w-md p-6 bg-background border border-border"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary-soft flex items-center justify-center">
                <User className="size-5" />
              </div>
              <div>
                <h2 className="font-display text-xl">Complete your profile</h2>
                <p className="text-xs text-foreground/60">
                  We need a few details before you continue.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <Field
                label="Full name"
                value={displayName}
                onChange={setDisplayName}
                placeholder="e.g. Adaeze Okafor"
              />
              <Field
                label="Phone number"
                value={phone}
                onChange={setPhone}
                placeholder="+234 800 000 0000"
                type="tel"
              />
              <Field
                label="Location / Address"
                value={location}
                onChange={setLocation}
                placeholder="Hall, Room or Shop address"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {saving && <Loader2 className="size-4 animate-spin" />}
              Save & continue
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs text-foreground/70">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}
