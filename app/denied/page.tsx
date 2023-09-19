import Link from "next/link"

export default function Denied() {
    return (
        <section className="flex flex-col min-h-screen">
			<div className="flex flex-col justify-center z-40 gap-12 items-center">
				<h1 className="text-5xl">Access Denied</h1>
				<p className="text-3xl max-w-2xl text-center">You are logged in, but you do not have the
					required access level to view this page.
				</p>
				<Link href={`${process.env.PUBLIC_URL_DEV}/api/auth/signout?callbackUrl=/`}>Sign Out</Link>
				<Link href={`${process.env.PUBLIC_URL_DEV}/`} className="text-3xl underline">Return to Home Page</Link>
			</div>
        </section>
    )
}