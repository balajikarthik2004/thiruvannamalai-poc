import { createContext, useContext, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * Lets a page put its own controls into the one app-wide top bar.
 *
 * The dashboard needs its State / District / Temple pickers up there, but every
 * other page just wants the breadcrumb. Rather than each page rendering a
 * second bar of its own — which is what produced two stacked headers with
 * duplicate bell and profile buttons — a page portals its controls into this
 * slot and the shell keeps ownership of the bar.
 */
const TopBarSlotContext = createContext<HTMLElement | null>(null);

export const TopBarSlotProvider = TopBarSlotContext.Provider;

/** Render children inside the top bar's left region. */
export function TopBarPortal({ children }: { children: ReactNode }) {
  const node = useContext(TopBarSlotContext);
  if (!node) return null;
  return createPortal(children, node);
}
