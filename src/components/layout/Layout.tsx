import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  // Close mobile menu on route change
  useEffect(() => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [location.pathname]);

  const toggleSidebar = () => {
    if (isMobile) {
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
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>

      {/* Sidebar with mobile overlay */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out 
          md:relative md:translate-x-0
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          ${!isSidebarOpen && "md:-translate-x-full"}
        `}
      >
        <Sidebar />
        {/* Mobile overlay backdrop */}
        <div
          className={`
            fixed inset-0 bg-black transition-opacity duration-300
            md:hidden
            ${isMobileMenuOpen ? "opacity-50" : "opacity-0 pointer-events-none"}
          `}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      </div>

      {/* Main content */}
      <main 
        className={`
          flex-1 p-4 md:p-8 pt-16 md:pt-8 
          transition-all duration-300
          ${isSidebarOpen ? "md:ml-64" : "md:ml-0"}
        `}
      >
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}