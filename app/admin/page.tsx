import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";

export default async function Admin() {
	const session = await getServerSession(authOptions);

    if (!session) {
        redirect(`${process.env.PUBLIC_URL_DEV}/api/auth/signin?callbackUrl=/admin`);
    }

	redirect('/admin/newPost');
}