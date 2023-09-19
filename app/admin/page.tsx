import Link from "next/link";
import AdminPanel from "@/components/AdminPanel";
import type { Metadata } from "next";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
	title: "Admin Page",
	description: "",
}

export default async function Admin() {
	const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/api/auth/signin?callbackUrl=/admin');
    }

    return (
        <div>
            <p>Hello {session.user.name}, you are a(n) {session.user.role}</p>
			<Link href={`${process.env.PUBLIC_URL_DEV}/`}>Home</Link>
			<Link href={`${process.env.PUBLIC_URL_DEV}/api/auth/signout?callbackUrl=/`}>Sign Out</Link>
			<AdminPanel/>
        </div>
    );
}