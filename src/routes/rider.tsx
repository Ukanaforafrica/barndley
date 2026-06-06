import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BioGate } from "@/components/BioGate";

export const Route = createFileRoute("/rider")({
  component: () => (
    <BioGate>
      <Outlet />
    </BioGate>
  ),
});
