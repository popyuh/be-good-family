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
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isCustomizing) {
      window.location.href = path;
    }
  };

  return (
    <Card 
      className="relative h-[140px] md:h-[180px] w-full cursor-pointer"
      onClick={() => !isCustomizing && (window.location.href = path)}
      onKeyPress={handleKeyPress}
      tabIndex={0}
      role="button"
      aria-label={`Go to ${label}`}
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
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.stopPropagation();
              onRemove();
            }
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      <div className="flex h-full flex-col p-4 md:p-6">
        <div className="flex items-start gap-3 md:gap-4">
          <div className="p-2 gradient-bg rounded-lg shrink-0">
            <Icon size={20} className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-sm md:text-base mb-1">
              {label}
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              {value}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};