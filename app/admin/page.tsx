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
};

export default function AdminPage(){
    const [signs, setSigns] = useState<Sign[]>([]);

    async function loadSigns(){
        const response = await fetch("/api/admin/signs");

        const result = await response.json();

        if(result.success) {
            setSigns(result.data);
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

    useEffect(() => {loadSigns();}, []);

    return(
            <main>
            {signs.map((sign) => (
                <div key={sign.id} className="mt-8 border rounded p-4">
                    <p>ID: {sign.id} Name: {sign.name}</p>
                    <p>Address: {sign.address}</p>
                    <p>Email: {sign.email}</p>
                    <p>Status: {sign.status}</p>
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



