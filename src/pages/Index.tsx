import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { 
  CheckSquare, 
  Calendar, 
  Target, 
  DollarSign 
} from "lucide-react";

const stats = [
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
];

const Index = () => {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8">Welcome Back, Family!</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={stat.label} 
                className="p-4 md:p-6 card-hover cursor-pointer"
                onClick={() => window.location.href = stat.path}
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="p-2 gradient-bg rounded-lg shrink-0">
                    <Icon size={20} className="md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm md:text-base">{stat.label}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 md:mt-12">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Recent Activity</h2>
          <Card className="p-4 md:p-6">
            <p className="text-sm md:text-base text-muted-foreground">No recent activity to show.</p>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Index;