import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/use-profile";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Calendar,
  CircleDollarSign,
  Home,
  MessageSquare,
  ShoppingCart,
  Target,
  CheckSquare,
  UtensilsCrossed,
} from "lucide-react";

export const Sidebar = () => {
  const location = useLocation();
  const { data: profile } = useProfile();

  const links = [
    { to: "/", icon: Home, label: "Dashboard" },
    { to: "/events", icon: Calendar, label: "Events" },
    { to: "/budget", icon: CircleDollarSign, label: "Budget" },
    { to: "/goals", icon: Target, label: "Goals" },
    { to: "/messages", icon: MessageSquare, label: "Messages" },
    { to: "/shopping", icon: ShoppingCart, label: "Shopping" },
    { to: "/tasks", icon: CheckSquare, label: "Tasks" },
    { to: "/meal-planning", icon: UtensilsCrossed, label: "Meal Planning" },
  ];

  return (
    <aside className="flex h-full w-64 flex-col bg-card border-r">
      <div className="flex h-16 items-center gap-3 border-b px-6">
        {profile?.avatar_url ? (
          <Avatar className="h-8 w-8">
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
        ) : profile?.emoji ? (
          <div 
            className="h-8 w-8 rounded-full flex items-center justify-center text-sm"
            style={{ backgroundColor: profile.color }}
          >
            {profile.emoji}
          </div>
        ) : null}
        <span className="text-lg font-semibold">BeGoodFamily</span>
      </div>
      
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {links.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              "active:bg-accent/80",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              location.pathname === to && "bg-accent text-accent-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}