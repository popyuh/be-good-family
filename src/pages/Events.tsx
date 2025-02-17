import { Layout } from "@/components/layout/Layout";
import { EventCalendar } from "@/components/events/EventCalendar";

export default function Events() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-4 animate-enter">
        <h1 className="text-3xl font-bold mb-6 text-gradient">Family Events</h1>
        <EventCalendar />
      </div>
    </Layout>
  );
}