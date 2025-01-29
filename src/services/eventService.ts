import { supabase, checkSupabaseConnection } from "@/lib/supabase";
import { Event } from "@/types/events";
import { parseISO } from "date-fns";

export const eventService = {
  async fetchEvents(): Promise<Event[]> {
    console.log("Fetching events from service...");
    
    const isConnected = await checkSupabaseConnection();
    if (!isConnected) {
      console.error("Supabase connection not available");
      throw new Error("Database connection not available. Please try again later.");
    }

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("start_date", { ascending: true });

    if (error) {
      console.error("Error fetching events:", error);
      throw error;
    }

    if (!data) {
      console.log("No events found");
      return [];
    }

    return data.map((event: any) => ({
      ...event,
      start_date: parseISO(event.start_date),
      end_date: event.end_date ? parseISO(event.end_date) : undefined,
      created_at: parseISO(event.created_at),
    }));
  },

  async createEvent(eventData: Omit<Event, "id" | "created_at">): Promise<Event> {
    console.log("Creating event:", eventData);
    
    const isConnected = await checkSupabaseConnection();
    if (!isConnected) {
      console.error("Supabase connection not available");
      throw new Error("Database connection not available. Please try again later.");
    }

    // Validate the event data
    if (!eventData.title || !eventData.start_date) {
      throw new Error("Missing required event data");
    }

    const { data, error } = await supabase
      .from("events")
      .insert([
        {
          ...eventData,
          start_date: eventData.start_date.toISOString(),
          end_date: eventData.end_date?.toISOString(),
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating event:", error);
      throw error;
    }

    if (!data) {
      throw new Error("Failed to create event");
    }

    return {
      ...data,
      start_date: parseISO(data.start_date),
      end_date: data.end_date ? parseISO(data.end_date) : undefined,
      created_at: parseISO(data.created_at),
    };
  },
};