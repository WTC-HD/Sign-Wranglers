import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabaseClient";
// import { resend } from "@/app/lib/resend"; // disabled until a domain is verified with Resend

export async function  GET(){
    const { data, error } = await supabase.from("signs").select().order("id", { ascending: true });

    if(error){
        return NextResponse.json({ error: error.message }, { status: 500}); 
    }

    return NextResponse.json({ success: true, data});
}

export async function PATCH(request: Request) {
  const { id, status } = await request.json();

    const { data, error } = await supabase
    .from("signs")
    .update({ status })
    .eq("id", id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  /* Status-update email disabled until a domain is verified with Resend.
  const sign = data[0];

  if (sign?.email) {
    const isPickup = sign.pickup_requested;

    const statusCopy: Record<string, string> = {
      enroute: isPickup
        ? "Your sign is enroute to be picked up."
        : "Your sign is enroute for delivery.",
      delivered: "Your sign has been delivered!",
      picked_up: "Your sign has been picked up!",
    };

    const message = statusCopy[status];

    if (message) {
      const { error: emailError } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: sign.email,
        subject: "Sign request update",
        html: `<p>Hi ${sign.name ?? "there"}, ${message}</p>`,
      });

      if (emailError) {
        console.error("Failed to send status update email:", emailError);
      }
    }
  }
  */

  return NextResponse.json({ success: true, data });
}