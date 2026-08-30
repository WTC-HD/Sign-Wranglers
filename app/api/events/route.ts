import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabaseClient";

const VALID_TYPES = [
  "feedback_yes",
  "feedback_no",
  "polling_lookup",
  "candidate_directory_visit",
  "voter_info_click",
];

export async function POST(request: Request) {
  const { type } = await request.json();

  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
  }

  const { error } = await supabase.from("events").insert({ type });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
