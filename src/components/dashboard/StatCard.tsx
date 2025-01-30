import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  path: string;
  isCustomizing?: boolean;
  onRemove?: () => void;
};

export const StatCard = ({ 
  icon: Icon, 
  label, 
  value, 
  path, 
  isCustomizing,
  onRemove 
}: StatCardProps) => {
  return (
    <Card 
      className="p-4 md:p-6 card-hover cursor-pointer relative"
      onClick={() => !isCustomizing && (window.location.href = path)}
    >
      {isCustomizing && onRemove && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute -top-2 -right-2 h-6 w-6 bg-destructive text-white hover:bg-destructive/90 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      <div className="flex items-center gap-3 md:gap-4">
        <div className="p-2 gradient-bg rounded-lg shrink-0">
          <Icon size={20} className="md:w-6 md:h-6" />
        </div>
        <div>
          <h3 className="font-semibold text-sm md:text-base">{label}</h3>
          <p className="text-xs md:text-sm text-muted-foreground">
            {value}
          </p>
        </div>
      </div>
    </Card>
  );
};