import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BioGate } from "@/components/BioGate";

export const Route = createFileRoute("/student")({
  component: () => (
    <BioGate>
      <Outlet />
    </BioGate>
  ),
});
