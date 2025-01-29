import { Card } from "@/components/ui/card";

type MessageThreadProps = {
  message: {
    content: string;
    author: string;
    timestamp: Date;
    emoji: string;
    color: string;
  };
};

export const MessageThread = ({ message }: MessageThreadProps) => {
  return (
    <Card className="p-3">
      <div className="flex items-start gap-3">
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
          style={{ backgroundColor: message.color }}
        >
          {message.emoji}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">{message.author}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(message.timestamp).toLocaleString()}
            </span>
          </div>
          <p className="text-sm">{message.content}</p>
        </div>
      </div>
    </Card>
  );
};