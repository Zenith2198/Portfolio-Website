import Link from "next/link";
import SmallNav from "./SmallNav";
import Nav from "./Nav";
import { getBaseUrl } from "@/lib/utils";
import Image from "next/image";
import { prisma } from "@/lib/db";
import type { Post } from "@prisma/client";
// import Search from "./Search";

export default async function Header() {
	const posts = await prisma.post.findMany({
		select: {
			title: true,
			path: true,
			postTypeId: true
		}
	}) as Post[];

	return (
		<header className="sticky top-0 z-40">
			<div className="justify-between navbar bg-base-100">
				<button id="skipNav" className="w-0 h-0"></button>
				<div className="navbar-start">
					<SmallNav posts={posts}/>
					<Link className="normal-case text-xl" href={`${getBaseUrl()}`}>
						<div className="avatar m-3">
							<div className="w-20">
								<Image src={`/images/profile.png`} alt="" fill={true}/>
							</div>
						</div>
					</Link>
					<div className="hidden lg:block">
						{/* <Search/> */}
					</div>
				</div>
				<div className="navbar-center hidden lg:flex">
					<Nav posts={posts}/>
				</div>
				<div className="navbar-end">
					<Link href={`${getBaseUrl()}/admin`}>Admin</Link>
					<Link href={`${getBaseUrl()}/api/auth/signout?callbackUrl=${getBaseUrl()}`}>Sign Out</Link>
				</div>
			</div>
		</header>
	);
}
