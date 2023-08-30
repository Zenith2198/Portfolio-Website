import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Admin() {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect("/api/auth/signin?callbackUrl=/admin");
	}
	let user = session.user;

	return (
		<div>
			<p>Hello {user.name}, you are a(n) {user.role}</p>
			<Link href="/api/auth/signout?callbackUrl=/">Sign Out</Link>
		</div>
	);
}