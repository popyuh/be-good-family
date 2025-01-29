import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type MessageGroupProps = {
  group: {
    id: string;
    name: string;
    messages: any[];
  };
  isSelected: boolean;
  onClick: () => void;
};

export const MessageGroup = ({ group, isSelected, onClick }: MessageGroupProps) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start mb-1",
        isSelected && "bg-primary"
      )}
      onClick={onClick}
    >
      <span className="truncate">{group.name}</span>
      <span className="ml-auto text-xs text-muted-foreground">
        {group.messages.length}
      </span>
    </Button>
  );
};