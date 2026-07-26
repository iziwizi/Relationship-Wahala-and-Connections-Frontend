// src/lib/services/notification.service.ts
// Customer notifications service — creates in-app notifications and prepares for future email dispatch

import { isDatabaseMode } from "@/lib/db/mode";

export interface CreateNotificationInput {
  userId: string;
  title: string;
  message: string;
  link?: string;
}

export async function sendNotification(input: CreateNotificationInput): Promise<void> {
  if (!isDatabaseMode()) return;
  try {
    const { prisma } = await import("@/lib/db/prisma");
    await prisma.notification.create({
      data: {
        userId: input.userId,
        title: input.title,
        message: input.message,
        link: input.link,
      },
    });
  } catch (err) {
    console.error("[Notification Service]", err);
  }
}
