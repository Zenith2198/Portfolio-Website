import Link from "next/link";
import { getBaseUrl } from "@/lib/utils";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
			<Link href={`${getBaseUrl()}/`}>Home</Link>
			<Link href={`${getBaseUrl()}/api/auth/signout?callbackUrl=/`}>Sign Out</Link>
			<div>
				{children}
			</div>
        </div>
    );
}