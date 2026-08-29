import { NextResponse } from "next/server";

const WYOMING_OCD_ID = "ocd-division/country:us/state:wy";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");

    if (!address) {
        return NextResponse.json({ error: "Address is required" }, { status: 400 });
    }

    const key = process.env.GOOGLE_CIVIC_API_KEY;

    // Google requires an explicit electionId — it no longer auto-detects
    // the current election for an address. Look up which election (if any)
    // it currently has indexed for Wyoming.
    const electionsResponse = await fetch(
        `https://www.googleapis.com/civicinfo/v2/elections?key=${key}`
    );
    const electionsData = await electionsResponse.json();

    const wyomingElection = (electionsData.elections ?? []).find(
        (election: { ocdDivisionId: string }) => election.ocdDivisionId === WYOMING_OCD_ID
    );

    if (!wyomingElection) {
        return NextResponse.json(
            { error: "Wyoming's election isn't available in the lookup system yet. Try again closer to Election Day." },
            { status: 404 }
        );
    }

    const voterInfoResponse = await fetch(
        `https://www.googleapis.com/civicinfo/v2/voterinfo?key=${key}&address=${encodeURIComponent(address)}&electionId=${wyomingElection.id}`
    );
    const voterInfoData = await voterInfoResponse.json();

    if (!voterInfoResponse.ok) {
        return NextResponse.json(
            { error: voterInfoData.error?.message ?? "Lookup failed" },
            { status: voterInfoResponse.status }
        );
    }

    return NextResponse.json({
        success: true,
        pollingLocations: voterInfoData.pollingLocations ?? [],
    });
}
