// src/lib/repositories/faqs.repository.ts
import { isDatabaseMode } from "@/lib/db/mode";
import { demoFAQs, DemoFAQ } from "@/data/demo/cms";

export async function getAllFAQs(): Promise<DemoFAQ[]> {
  if (!isDatabaseMode()) return demoFAQs;
  try {
    const { prisma } = await import("@/lib/db/prisma");
    const faqs = await prisma.fAQ.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    return faqs.map((f) => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
      category: f.category,
      sortOrder: f.sortOrder,
    }));
  } catch (err) {
    console.warn("[FAQs Repository] DB query failed, falling back to demo data:", err);
    return demoFAQs;
  }
}
