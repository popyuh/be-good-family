import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation } from "react-router-dom";

// Navigation items (matching sidebar items)
const navigationItems = [
  { to: "/", icon: "Home", label: "Dashboard" },
  { to: "/events", icon: "Calendar", label: "Events" },
  { to: "/budget", icon: "CircleDollarSign", label: "Budget" },
  { to: "/goals", icon: "Target", label: "Goals" },
  { to: "/messages", icon: "MessageSquare", label: "Messages" },
  { to: "/shopping", icon: "ShoppingCart", label: "Shopping" },
  { to: "/tasks", icon: "CheckSquare", label: "Tasks" },
  { to: "/meal-planning", icon: "UtensilsCrossed", label: "Meal Planning" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  // Close mobile dropdown on route change
  useEffect(() => {
    if (isMobile) {
      setIsDropdownOpen(false);
    }
  }, [location.pathname, isMobile]);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Dropdown Menu */}
      {isMobile ? (
        <div className="fixed top-4 left-4 z-50">
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-background"
              align="start"
              sideOffset={5}
            >
              {navigationItems.map((item) => (
                <DropdownMenuItem key={item.to} asChild>
                  <Link
                    to={item.to}
                    className="w-full px-2 py-2 cursor-pointer"
                  >
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        /* Desktop Sidebar */
        <div
          className={`
            relative transform transition-transform duration-300 ease-in-out
            ${!isSidebarOpen ? "-translate-x-full" : "translate-x-0"}
          `}
        >
          <Sidebar />
        </div>
      )}

      {/* Main content */}
      <main 
        className={`
          flex-1 p-4 md:p-8 pt-16 md:pt-8 
          transition-all duration-300
          ${isSidebarOpen && !isMobile ? "md:ml-64" : "md:ml-0"}
        `}
      >
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}