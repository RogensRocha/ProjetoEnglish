import Sidebar from "@/components/layout/Sidebar";
import type { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-900 text-gray-100 flex">
      <Sidebar />
      <div className="flex-1 ml-64 min-h-screen flex flex-col">
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
