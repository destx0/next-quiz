import { NextResponse } from "next/server";
import { getOrganizerStructure } from "@/lib/organizerService";

export async function GET() {
  try {
    const data = await getOrganizerStructure();
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch organizer data" },
      { status: 500 }
    );
  }
}
