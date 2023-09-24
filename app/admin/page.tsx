import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";

export default async function Admin() {
	const session = await getServerSession(authOptions);

    if (!session) {
        redirect(`${process.env.NEXT_PUBLIC_URL}/api/auth/signin?callbackUrl=/admin`);
    }

	redirect(`${process.env.NEXT_PUBLIC_URL}/admin/newPost`);
}