import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateEventDialog } from "./CreateEventDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Event } from "@/types/events";
import { format, isValid } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

export function EventCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      try {
        console.log("Fetching events from Supabase...");
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .order("start_date", { ascending: true });

        if (error) {
          console.error("Supabase error:", error);
          throw new Error(error.message);
        }

        if (!data) {
          console.log("No events found in database");
          return [];
        }

        console.log("Raw events data:", data);
        
        // Carefully parse and validate dates
        return data.map((event: any) => {
          const startDate = new Date(event.start_date);
          const endDate = event.end_date ? new Date(event.end_date) : undefined;
          const createdAt = new Date(event.created_at);

          // Validate dates
          if (!isValid(startDate)) {
            console.error("Invalid start date for event:", event);
            throw new Error("Invalid event date format");
          }

          return {
            ...event,
            start_date: startDate,
            end_date: endDate && isValid(endDate) ? endDate : undefined,
            created_at: isValid(createdAt) ? createdAt : new Date(),
          };
        });
      } catch (error: any) {
        console.error("Error in events query:", error);
        toast({
          title: "Error loading events",
          description: error.message || "Failed to load events",
          variant: "destructive",
        });
        throw error;
      }
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * (2 ** attemptIndex), 30000),
    staleTime: 30000, // Cache data for 30 seconds
    refetchOnWindowFocus: false,
  });

  if (error) {
    console.error("Query error details:", error);
  }

  const selectedDateEvents = events.filter((event) => {
    if (!date || !event.start_date) return false;
    try {
      const eventDate = format(event.start_date, "yyyy-MM-dd");
      const selectedDate = format(date, "yyyy-MM-dd");
      return eventDate === selectedDate;
    } catch (error) {
      console.error("Error comparing dates:", error);
      return false;
    }
  });

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
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            disabled={!date}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <Card className="p-4 text-center text-destructive">
            <p>Error loading events. Please try again later.</p>
            <p className="text-sm mt-2">{error instanceof Error ? error.message : 'Unknown error'}</p>
          </Card>
        ) : selectedDateEvents.length > 0 ? (
          <div className="space-y-4">
            {selectedDateEvents.map((event) => (
              <Card key={event.id} className="p-4">
                <h3 className="font-semibold">{event.title}</h3>
                {event.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {event.description}
                  </p>
                )}
                <p className="text-sm text-muted-foreground mt-2">
                  {format(event.start_date, "h:mm a")}
                  {event.end_date &&
                    ` - ${format(event.end_date, "h:mm a")}`}
                </p>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-4 text-center text-muted-foreground">
            No events scheduled for this date
          </Card>
        )}
      </div>

      <CreateEventDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        selectedDate={date}
      />
    </div>
  );
}