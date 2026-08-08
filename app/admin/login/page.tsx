"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage(){
    const [showAdminLogin, setShowAdminLogin] = useState(false);
    const [password, setPassword] = useState("");

    const router = useRouter();
    const [statusMessage, setStatusMessage] = useState("");

    useEffect(() => {
        async function loadSigns(){

        }
        loadSigns();
    }, []);

    async function handleLogin(){
        const response = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "aplication/json"},
            body: JSON.stringify({ password })
        });

        const result = await response.json();

        if(result.success){
            router.push("/admin");
        } else {
            setStatusMessage("Incorrect password");
        }
    }
    
    return(
        <main>
            <button
            onClick={() => setShowAdminLogin(true)}
            className="mt-8 border rounded px-4 py-2 bg-blue-600"
            >
                admin log in
            </button>

            {showAdminLogin === true &&(
                <div>
                    <p className="mt-4"> Enter Admin Passcode </p>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="mt-8 border rounded px-4 py-2 text-white block"
                        />
                </div>
            )}

            <button onClick={handleLogin} className="mt-8 border rounded px-4 py-2 bg-blue-600">
                Submit
            </button>
            {statusMessage && <p className="mt-4">{statusMessage}</p>}
        </main>
    )
}
