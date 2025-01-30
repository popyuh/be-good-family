import { 
  CheckSquare, 
  Calendar, 
  Target, 
  DollarSign,
  ShoppingCart,
  MessageCircle
} from "lucide-react";
import { StatItem } from "@/types/dashboard";

export const availableStats: StatItem[] = [
  { 
    icon: CheckSquare, 
    label: "Tasks", 
    value: "5 pending", 
    path: "/tasks" 
  },
  { 
    icon: Calendar, 
    label: "Events", 
    value: "2 upcoming", 
    path: "/events" 
  },
  { 
    icon: Target, 
    label: "Goals", 
    value: "3 active", 
    path: "/goals" 
  },
  { 
    icon: DollarSign, 
    label: "Budget", 
    value: "$1,200 saved", 
    path: "/budget" 
  },
  {
    icon: ShoppingCart,
    label: "Shopping",
    value: "3 items",
    path: "/shopping"
  },
  {
    icon: MessageCircle,
    label: "Messages",
    value: "2 groups",
    path: "/messages"
  }
];