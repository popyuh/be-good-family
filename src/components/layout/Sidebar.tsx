import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  CheckSquare, 
  Calendar, 
  Target, 
  DollarSign,
  Home
} from "lucide-react";

const navItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: CheckSquare, label: "Tasks", path: "/tasks" },
  { icon: Calendar, label: "Events", path: "/events" },
  { icon: Target, label: "Goals", path: "/goals" },
  { icon: DollarSign, label: "Budget", path: "/budget" },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="h-screen w-64 gradient-bg p-4 flex flex-col gap-2">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Our Family Hub</h1>
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                "hover:bg-white/20",
                location.pathname === item.path ? "bg-white/30" : "transparent"
              )}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}