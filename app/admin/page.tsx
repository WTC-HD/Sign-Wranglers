"use client";
import { useState } from "react";
import { useEffect } from "react";
  
type Sign = {
  id: number;
  name: string;
  address: string;
  email: string;
  status: string;
  pickup_requested: boolean;
  // Object shape ({name: quantity}) comes from a dropoff request; array
  // shape (just names, no quantity) comes from a pickup request. Both are
  // written by different API routes, so this type has to allow both.
  candidates: Record<string, string> | string[] | null;
};

function formatCandidates(candidates: Sign["candidates"]) {
  if (!candidates) return null;
  if (Array.isArray(candidates)) return candidates.join(", ");
  return Object.entries(candidates)
    .map(([name, quantity]) => `${quantity} x ${name}`)
    .join(", ");
}

type SiteEvent = { type: string };

function countEvents(events: SiteEvent[], type: string) {
  return events.filter((event) => event.type === type).length;
}

export default function AdminPage(){
    const [signs, setSigns] = useState<Sign[]>([]);
    const [events, setEvents] = useState<SiteEvent[]>([]);

    async function loadSigns(){
        const response = await fetch("/api/admin/signs");

        const result = await response.json();

        if(result.success) {
            setSigns(result.data);
        }

    }

    async function loadEvents(){
        const response = await fetch("/api/admin/events");

        const result = await response.json();

        if(result.success) {
            setEvents(result.data);
        }
    }

    async function updateStatus(id: number, newStatus: string) {
    await fetch("/api/admin/signs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ id, status: newStatus}),
    });
    await loadSigns();
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- fetching data on mount is a documented valid use of useEffect
        loadSigns();
        loadEvents();
    }, []);

    return(
            <main>
            <div className="mt-8 border rounded p-4">
                <p>Site Stats</p>
                <p>Feedback: {countEvents(events, "feedback_yes")} yes / {countEvents(events, "feedback_no")} no</p>
                <p>Polling place lookups: {countEvents(events, "polling_lookup")}</p>
                <p>Candidate directory visits: {countEvents(events, "candidate_directory_visit")}</p>
            </div>

            {signs.map((sign) => (
                <div key={sign.id} className="mt-8 border rounded p-4">
                    <p>ID: {sign.id} Name: {sign.name}</p>
                    <p>Address: {sign.address}</p>
                    <p>Email: {sign.email}</p>
                    <p>Status: {sign.status}</p>
                    {formatCandidates(sign.candidates) && (
                        <p>Candidates: {formatCandidates(sign.candidates)}</p>
                    )}
                    <p>{renderButton(sign)}</p>
                </div>
            ))}
            </main>
    )

    function renderButton(sign: Sign) {
        if (sign.status === "requested" || sign.status === "pickup_requested") {
            return <button onClick={() => updateStatus(sign.id, "enroute")}>Mark Enroute</button>;
        } else if (sign.status === "enroute" && !sign.pickup_requested) {
            return <button onClick={() => updateStatus(sign.id, "delivered")}>Mark Delivered</button>;
        } else if (sign.status === "enroute" && sign.pickup_requested) {
            return <button onClick={() => updateStatus(sign.id, "picked_up")}>Mark Picked Up</button>;
        }
        return null; // nothing to show once it's done
}
}



