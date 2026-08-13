import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabaseClient";
// import { resend } from "@/app/lib/resend"; // disabled until a domain is verified with Resend

export async function POST(request: Request) {
  const body = await request.json();

  const { name, address, email, candidates } = body;

  if (!name || !address || !email || !candidates || candidates.length === 0) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // The frontend only sends candidate names now (no quantity picker) -
  // every selected candidate defaults to a quantity of 1 sign.
  const candidatesWithQuantity = Object.fromEntries(
    (candidates as string[]).map((candidateName) => [candidateName, "1"])
  );

  const { data, error } = await supabase
    .from("signs")
    .insert({
        name,
        address,
        email,
        candidates: candidatesWithQuantity,
        status: "requested",
    })
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  /* Email confirmation disabled until a domain is verified with Resend
     (onboarding@resend.dev can only send to the account owner, not real users).

  const candidateList = Object.entries(candidatesWithQuantity)
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
  */

  return NextResponse.json({ success: true, data });
}