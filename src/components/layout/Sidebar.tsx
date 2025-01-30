import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
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
    <aside className="hidden md:flex h-screen w-64 flex-col fixed left-0 top-0 border-r bg-card">
      <div className="flex h-14 items-center border-b px-4 font-semibold">
        Family Hub
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {links.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent",
              location.pathname === to && "bg-accent"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};