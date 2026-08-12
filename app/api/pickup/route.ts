import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabaseClient";
// import { resend } from "@/app/lib/resend"; // disabled until a domain is verified with Resend

export async function POST(request: Request) {
    const body = await request.json();
    const { mode, email, address, name, candidates } = body;

    if(mode === "used_website"){
        if(!email){
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("signs")
            .update({status: "pickup_requested", pickup_requested: true})
            .eq("email", email)
            .select();

        if(error){
            return NextResponse.json({ error: error.message }, {status: 500});
        }

        if(data.length === 0){
            return NextResponse.json(
                { error: "No matching request found for that email"},
                { status:404}
            );
        }

        /* Email confirmation disabled until a domain is verified with Resend.
        const { error: emailError } = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Pickup request received",
            html: `<p>Hi ${data[0]?.name ?? "there"}, we got your pickup request.</p>`,
        });

        if (emailError) {
            console.error("Failed to send pickup confirmation email:", emailError);
        }
        */

        return NextResponse.json({ success: true, data});
    }

    if(mode === "not_used"){
        if(!address){
            return NextResponse.json( {error: "Address is required"}, { status: 400});
        }

        const {data, error} = await supabase
            .from("signs")
            .insert({
                name,
                address,
                email,
                candidates,
                status: "pickup_requested",
                pickup_requested: true,
            })
            .select();

        if (error){
            return NextResponse.json({ error: error.message}, { status: 500});
        }

        /* Email confirmation disabled until a domain is verified with Resend.
        if (email) {
            const { error: emailError } = await resend.emails.send({
                from: "onboarding@resend.dev",
                to: email,
                subject: "Pickup request received",
                html: `<p>Hi ${name ?? "there"}, we got your pickup request.</p>`,
            });

            if (emailError) {
                console.error("Failed to send pickup confirmation email:", emailError);
            }
        }
        */

       return NextResponse.json({ success: true, data });
  }

  return NextResponse.json({ error: "Invalid mode" }, { status: 400 });

 }