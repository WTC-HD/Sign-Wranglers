import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabaseClient";
import { resend } from "@/app/lib/resend";

export async function POST(request: Request) {
  const body = await request.json();

  const { name, address, email, candidates } = body;

  if (!name || !address || !email || !candidates || Object.keys(candidates).length === 0) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const hasInvalidQuantity = Object.values(candidates).some(
    (quantity) => !quantity || Number(quantity) <= 0
  );

  if (hasInvalidQuantity) {
    return NextResponse.json(
      { error: "Please enter a quantity for each selected candidate" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("signs")
    .insert({
        name,
        address,
        email,
        candidates,
        status: "requested",
    })
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const candidateList = Object.entries(candidates)
    .map(([candidateName, quantity]) => `${quantity} x ${candidateName}`)
    .join(", ");

  const { error: emailError } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Sign request received",
    html: `<p>Hi ${name}, we got your request for: ${candidateList}.</p>`,
  });

  if (emailError) {
    console.error("Failed to send confirmation email:", emailError);
  }

  return NextResponse.json({ success: true, data });
}