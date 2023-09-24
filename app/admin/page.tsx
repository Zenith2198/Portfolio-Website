import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { getBaseUrl } from "@/lib/utils";

export default async function Admin() {
	const session = await getServerSession(authOptions);

    if (!session) {
        redirect(`${getBaseUrl()}/api/auth/signin?callbackUrl=/admin`);
    }

	redirect(`${getBaseUrl()}/admin/newPost`);
}