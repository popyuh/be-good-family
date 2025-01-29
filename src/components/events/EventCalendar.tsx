import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateEventDialog } from "./CreateEventDialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { eventService } from "@/services/eventService";
import { DayEventsList } from "./DayEventsList";

export function EventCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: events = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["events"],
    queryFn: eventService.fetchEvents,
    staleTime: 30000,
    retry: (failureCount, error) => {
      console.log(`Retry attempt ${failureCount}`, error);
      return failureCount < 3;
    },
  });

  const selectedDateEvents = date
    ? events.filter((event) => {
        const eventDate = format(event.start_date, "yyyy-MM-dd");
        const selectedDate = format(date, "yyyy-MM-dd");
        return eventDate === selectedDate;
      })
    : [];

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <Card className="p-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md"
        />
      </Card>

      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">
            Events for {date ? format(date, "MMMM d, yyyy") : "Selected Date"}
          </h2>
          <Button onClick={() => setIsCreateDialogOpen(true)} disabled={!date}>
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>

        <DayEventsList
          events={selectedDateEvents}
          isLoading={isLoading}
          error={error instanceof Error ? error : null}
        />
      </div>

      <CreateEventDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        selectedDate={date}
      />
    </div>
  );
}