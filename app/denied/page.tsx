import Link from "next/link";
import { getBaseUrl } from "@/lib/utils";

export default function Denied() {
    return (
        <section className="flex flex-col min-h-screen">
			<div className="flex flex-col justify-center z-40 gap-12 items-center">
				<h1 className="text-5xl">Access Denied</h1>
				<p className="text-3xl max-w-2xl text-center">You are logged in, but you do not have the
					required access level to view this page.
				</p>
				<Link href={`${getBaseUrl()}/api/auth/signout?callbackUrl=/`}>Sign Out</Link>
				<Link href={`${getBaseUrl()}/`} className="text-3xl underline">Return to Home Page</Link>
			</div>
        </section>
    )
}