import { Event } from "@/types/events";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";

interface DayEventsListProps {
  events: Event[];
  isLoading: boolean;
  error: Error | null;
}

export function DayEventsList({ events, isLoading, error }: DayEventsListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-4 text-center text-destructive">
        <p>Error loading events</p>
        <p className="text-sm mt-2">{error.message}</p>
      </Card>
    );
  }

  if (events.length === 0) {
    return (
      <Card className="p-4 text-center text-muted-foreground">
        No events scheduled for this date
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Card key={event.id} className="p-4">
          <h3 className="font-semibold">{event.title}</h3>
          {event.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {event.description}
            </p>
          )}
          <p className="text-sm text-muted-foreground mt-2">
            {format(event.start_date, "h:mm a")}
            {event.end_date && ` - ${format(event.end_date, "h:mm a")}`}
          </p>
        </Card>
      ))}
    </div>
  );
}