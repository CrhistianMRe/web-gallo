import { NavBar } from "./NavBar";
import { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <NavBar />
      <main style={{ flex: 1, maxWidth: 960, width: "100%", margin: "0 auto" }}>
        {children}
      </main>
    </div>
  );
}
