import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";

type AddStatCardProps = {
  onClick: () => void;
};

export const AddStatCard = ({ onClick }: AddStatCardProps) => {
  return (
    <Card 
      className="p-4 md:p-6 card-hover cursor-pointer border-dashed"
      onClick={onClick}
    >
      <div className="flex items-center justify-center h-full">
        <Plus className="h-6 w-6 text-muted-foreground" />
      </div>
    </Card>
  );
};