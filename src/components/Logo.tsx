import { Link } from "@tanstack/react-router";
import logoUrl from "@/assets/logo.png";

export function Logo({ to = "/" }: { to?: string }) {
  return (
    <Link to={to} className="inline-flex items-center group">
      <img
        src={logoUrl}
        alt="gomarkket"
        className="h-7 w-auto object-contain"
      />
    </Link>
  );
}
