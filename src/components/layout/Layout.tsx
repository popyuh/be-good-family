import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Changed default to true for desktop
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Sidebar with mobile overlay */}
      <div
        className={`${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          !isSidebarOpen && "md:-translate-x-full"
        }`}
      >
        <Sidebar />
        {/* Mobile overlay backdrop */}
        <div
          className={`${
            isMobileMenuOpen ? "opacity-50" : "opacity-0 pointer-events-none"
          } fixed inset-0 bg-black md:hidden transition-opacity duration-300`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      </div>

      {/* Main content */}
      <main className={`flex-1 p-4 md:p-8 pt-16 md:pt-8 transition-all duration-300 ${
        isSidebarOpen ? "md:ml-64" : "md:ml-0"
      }`}>
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}