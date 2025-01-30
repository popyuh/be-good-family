import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Menu, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/use-profile";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation } from "react-router-dom";

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
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: profile } = useProfile();

  const handleLogout = async () => {
    try {
      console.log("Attempting to log out...");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "You have been logged out successfully",
      });
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (isMobile) {
      setIsDropdownOpen(false);
    }
  }, [location.pathname, isMobile]);

  return (
    <div className="flex min-h-screen max-w-full overflow-x-hidden bg-background">
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
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="w-full px-2 py-2 cursor-pointer flex items-center gap-2">
                  {profile?.avatar_url ? (
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={profile.avatar_url} />
                      <AvatarFallback>
                        <div 
                          className="w-full h-full flex items-center justify-center"
                          style={{ backgroundColor: profile.color }}
                        >
                          {profile.emoji}
                        </div>
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div 
                      className="h-6 w-6 rounded-full flex items-center justify-center text-sm"
                      style={{ backgroundColor: profile?.color }}
                    >
                      {profile?.emoji}
                    </div>
                  )}
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-red-500 focus:text-red-500 focus:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div
          className={`
            relative transform transition-transform duration-300 ease-in-out
            ${!isSidebarOpen ? "-translate-x-full" : "translate-x-0"}
          `}
        >
          <Sidebar />
        </div>
      )}

      <main 
        className={`
          flex-1 p-4 md:p-8 pt-16 md:pt-8 
          transition-all duration-300 overflow-x-hidden
          ${isSidebarOpen && !isMobile ? "md:ml-64" : "md:ml-0"}
        `}
      >
        <div className="max-w-7xl mx-auto w-full px-4 md:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}