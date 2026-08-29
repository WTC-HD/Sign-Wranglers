import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request){
    const { password } = await request.json();
    const storeCookies = await cookies();


    if(!password){
        return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400}
        );
    }

    if(password !== process.env.ADMIN_PASSWORD){
        return NextResponse.json(
            { error: "Incorrect password" },
            { status: 401}
        );
    } else {
        // The cookie's value is the password itself, not a signed token -
        // a simplified shared secret. proxy.ts checks it by comparing
        // straight against ADMIN_PASSWORD, no separate session store needed.
        storeCookies.set("admin_session", process.env.ADMIN_PASSWORD ?? "", {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 86400,
        });
        return NextResponse.json({ success: true})
    }
    
    

    
}
