import Link from "next/link";
import AdminPanel from "@/components/adminPanel";
import type { Metadata } from "next";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { getAllPostTypes } from "@/lib/db";

export const metadata: Metadata = {
	title: "Admin Page",
	description: "",
}

export default async function Admin() {
	const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/api/auth/signin?callbackUrl=/admin')
    }

	const allPostTypes = await getAllPostTypes();

    return (
        <div>
            <p>Hello {session.user.name}, you are a(n) {session.user.role}</p>
			<AdminPanel allPostTypes={allPostTypes}/>
			<Link href="/">Home</Link>
			<Link href="/api/auth/signout?callbackUrl=/">Sign Out</Link>
        </div>
    )
}