import { supabase } from "@/lib/supabase";
import { Event } from "@/types/events";
import { isValid, parseISO } from "date-fns";

export const eventService = {
  async fetchEvents(): Promise<Event[]> {
    console.log("Fetching events from service...");
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("start_date", { ascending: true });

    if (error) {
      console.error("Error fetching events:", error);
      throw error;
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
    const { data, error } = await supabase
      .from("events")
      .insert([
        {
          ...eventData,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating event:", error);
      throw error;
    }

    return {
      ...data,
      start_date: parseISO(data.start_date),
      end_date: data.end_date ? parseISO(data.end_date) : undefined,
      created_at: parseISO(data.created_at),
    };
  },
};