"use client"

import { useSession } from "next-auth/react"
import React, { useState } from 'react';
import { redirect } from "next/navigation"
import Link from "next/link";
import Editor from "@/components/editor";

export default function Admin() {
	const [data, setData] = useState(false);

    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            redirect("/api/auth/signin?callbackUrl=/admin")
        }
    })

    if (!session?.user) return

    return (
        <div>
            <p>Hello {session.user.name}, you are a(n) {session.user.role}</p>
			<Editor setData={setData}/>
			<div>{JSON.stringify(data)}</div>
			<Link href="/api/auth/signout?callbackUrl=/">Sign Out</Link>
        </div>
    )
}