import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export default async function Admin() {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect("/api/auth/signin?callbackUrl=/admin");
	}

	return (
		<div>Hi there!</div>
	);
}