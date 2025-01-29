import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen relative">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Sidebar with mobile overlay */}
      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-0 z-40 md:relative md:translate-x-0 transition-transform duration-200 ease-in-out`}
      >
        <Sidebar />
        {/* Mobile overlay backdrop */}
        <div
          className={`${
            isSidebarOpen ? "opacity-50" : "opacity-0 pointer-events-none"
          } fixed inset-0 bg-black md:hidden`}
          onClick={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 pt-16 md:pt-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}