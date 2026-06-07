import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { formatNaira } from "@/lib/mock";
import { Heart, ShieldCheck } from "lucide-react";
import type { CartLine } from "@/lib/cart-store";
import { groupByShop, cartTotal } from "@/lib/cart-store";

export const Route = createFileRoute("/sponsor/$payload")({
  head: () => ({ meta: [{ title: "Pay for a basket — guorrow" }] }),
  component: SponsorPage,
});

function decodePayload(payload: string): {
  lines: CartLine[];
  studentName?: string;
  note?: string;
} | null {
  try {
    const json = decodeURIComponent(escape(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))));
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed?.lines)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function SponsorPage() {
  const { payload } = Route.useParams();
  const data = useMemo(() => decodePayload(payload), [payload]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="card-soft p-8 max-w-md text-center">
          <h1 className="font-display text-2xl">Link unavailable</h1>
          <p className="text-sm text-foreground/60 mt-2">
            This basket link is invalid or has expired.
          </p>
        </div>
      </div>
    );
  }

  const groups = groupByShop(data.lines);
  const subtotal = cartTotal(data.lines);
  const delivery = data.lines.length === 0 ? 0 : 350 + Math.max(0, groups.length - 1) * 200;
  const serviceFee = 100;
  const total = subtotal + delivery + serviceFee;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-[480px] mx-auto">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-primary-soft items-center justify-center">
            <Heart className="size-6 text-primary" />
          </div>
          <h1 className="font-display text-2xl mt-3">
            {data.studentName ? `${data.studentName} sent you a basket` : "A student sent you a basket"}
          </h1>
          <p className="text-sm text-foreground/60 mt-1">
            Review the items and pay on their behalf — items will be delivered to their campus address.
          </p>
        </div>

        {data.note && (
          <div className="mt-4 card-soft p-3 text-sm italic text-foreground/80 bg-accent-soft border-accent/30">
            "{data.note}"
          </div>
        )}

        <div className="mt-5 space-y-3">
          {groups.map((g) => (
            <div key={g.shopId} className="card-soft p-1">
              <div className="flex items-center gap-2 px-3 py-2">
                <div className="h-9 w-9 rounded-lg bg-primary-soft flex items-center justify-center text-lg">
                  {g.shopEmoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{g.shopName}</div>
                  <div className="text-[0.7rem] text-foreground/60">
                    {g.lines.length} item{g.lines.length > 1 ? "s" : ""}
                  </div>
                </div>
              </div>
              <ul className="divide-y divide-border/60">
                {g.lines.map((l) => (
                  <li key={l.productId + l.measurement.id} className="flex items-center gap-3 p-3">
                    <div className="h-12 w-12 rounded-xl bg-primary-soft flex items-center justify-center text-2xl">
                      {l.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{l.productName}</div>
                      <div className="text-xs text-foreground/60">
                        {l.measurement.label} • {formatNaira(l.measurement.price)} × {l.qty}
                      </div>
                    </div>
                    <div className="text-sm font-display">
                      {formatNaira(l.measurement.price * l.qty)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-4 card-soft p-4 text-sm space-y-2">
          <Row label="Subtotal" value={formatNaira(subtotal)} />
          <Row label="Delivery" value={formatNaira(delivery)} />
          <Row label="Service fee" value={formatNaira(serviceFee)} />
          <div className="border-t border-border/60 pt-2 mt-2">
            <Row bold label="Total" value={formatNaira(total)} />
          </div>
        </div>

        <button
          className="mt-5 w-full block text-center py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold"
          onClick={() => alert("Payment flow coming soon.")}
        >
          Pay {formatNaira(total)} now
        </button>

        <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-foreground/60">
          <ShieldCheck className="size-3.5" /> Secure payment · Funds go directly to vendors
        </div>

        <Link to="/" className="mt-6 block text-center text-xs text-foreground/50 underline">
          What is guorrow?
        </Link>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={"flex items-center justify-between " + (bold ? "font-display text-lg" : "text-foreground/70")}>
      <span>{label}</span>
      <span className={bold ? "" : "text-foreground"}>{value}</span>
    </div>
  );
}
