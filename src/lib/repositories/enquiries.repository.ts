// src/lib/repositories/enquiries.repository.ts
// ContactEnquiry data access — demo/database transparent

import { isDatabaseMode } from "@/lib/db/mode";

export interface EnquiryCreateInput {
  name: string;
  email: string;
  phone?: string;
  category: string;
  message: string;
}

export async function createEnquiry(data: EnquiryCreateInput): Promise<{ id: string }> {
  if (!isDatabaseMode()) {
    // Demo mode — just return a fake ID
    return { id: `demo-enq-${Date.now()}` };
  }
  const { prisma } = await import("@/lib/db/prisma");
  const enq = await prisma.contactEnquiry.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      category: data.category,
      message: data.message,
    },
  });
  return { id: enq.id };
}

export async function getAllEnquiries() {
  if (!isDatabaseMode()) return [];
  const { prisma } = await import("@/lib/db/prisma");
  return prisma.contactEnquiry.findMany({ orderBy: { createdAt: "desc" } });
}
