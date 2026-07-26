// src/lib/repositories/events.repository.ts
import { isDatabaseMode } from "@/lib/db/mode";
import { demoEvents, DemoEvent } from "@/data/demo/cms";

export async function getAllEvents(): Promise<DemoEvent[]> {
  if (!isDatabaseMode()) return demoEvents;
  const { prisma } = await import("@/lib/db/prisma");
  const events = await prisma.event.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { eventDate: "asc" },
  });
  return events.map((e) => ({
    id: e.id,
    title: e.title,
    slug: e.slug,
    description: e.description,
    eventDate: e.eventDate.toISOString().split("T")[0],
    eventTime: e.eventTime,
    location: e.location,
    isOnline: e.isOnline,
    registrationUrl: e.registrationUrl || "/register",
    image: e.image || "/images/service-counseling.jpg",
  }));
}
