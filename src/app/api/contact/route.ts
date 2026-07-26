// src/app/api/contact/route.ts
// Contact form submissions — saves to DB in database mode, returns success in demo mode

import { NextRequest, NextResponse } from "next/server";
import { createEnquiry } from "@/lib/repositories/enquiries.repository";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      name: string;
      email: string;
      phone?: string;
      category: string;
      message: string;
    };

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
    }

    const enquiry = await createEnquiry({
      name: body.name.trim(),
      email: body.email.toLowerCase().trim(),
      phone: body.phone?.trim(),
      category: body.category || "General",
      message: body.message.trim(),
    });

    return NextResponse.json({
      success: true,
      id: enquiry.id,
      message: "Thank you for your enquiry. Our team will be in touch within 24-48 hours.",
    });
  } catch (error) {
    console.error("[Contact API]", error);
    return NextResponse.json({ error: "Failed to submit enquiry." }, { status: 500 });
  }
}
