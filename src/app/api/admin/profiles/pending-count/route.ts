import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const count = await prisma.profile.count({
      where: { status: "PENDING_VERIFICATION" },
    });
    return NextResponse.json({ count });
  } catch (error) {
    console.error("pending-count error:", error);
    return NextResponse.json({ count: 0 });
  }
}
