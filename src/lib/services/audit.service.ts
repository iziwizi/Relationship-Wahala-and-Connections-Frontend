// src/lib/services/audit.service.ts
// Audit logging service for Super Admin actions — never logs secrets or credentials

import { isDatabaseMode } from "@/lib/db/mode";
import type { Prisma } from "@/generated/prisma";

export interface LogAdminActionInput {
  adminId: string;
  action: string; // e.g. "PROFILE_VERIFIED", "PAYMENT_APPROVED", "BLOG_POST_PUBLISHED"
  targetType?: string;
  targetId?: string;
  details?: Record<string, unknown>;
}

export async function logAdminAction(input: LogAdminActionInput): Promise<void> {
  if (!isDatabaseMode()) return;
  try {
    const { prisma } = await import("@/lib/db/prisma");
    await prisma.adminAuditLog.create({
      data: {
        adminId: input.adminId,
        action: input.action,
        targetType: input.targetType,
        targetId: input.targetId,
        details: (input.details ?? {}) as Prisma.InputJsonValue,
      },
    });
  } catch (err) {
    console.error("[AuditLog Service]", err);
  }
}
