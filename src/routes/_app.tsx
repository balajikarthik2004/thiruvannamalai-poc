import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { CartProvider } from "@/features/store/context/CartContext";

export const Route = createFileRoute("/_app")({
  component: () => (
    <CartProvider>
      <AppShell />
    </CartProvider>
  ),
});
