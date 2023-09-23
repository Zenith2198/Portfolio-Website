import Link from "next/link";
import SmallNav from "./SmallNav";
import Nav from "./Nav";
import { buildURLParams } from "@/lib/utils";
import Image from "next/image";
// import Search from "./Search";

export default function Header() {
	const urlQuery = buildURLParams({ sort: [{ sortField: "dateModified", desc: true }] });

	return (
		<header className="sticky top-0 z-40">
			<div className="justify-between navbar bg-base-100">
				<button id="skipNav" className="w-0 h-0"></button>
				<div className="navbar-start">
					<SmallNav urlQuery={urlQuery}/>
					<Link className="normal-case text-xl" href={`${process.env.PUBLIC_URL_DEV}/`}>
						<div className="avatar m-3">
							<div className="w-20">
								<Image src={`${process.env.PUBLIC_URL_DEV}/images/profile.png`} alt="" fill={true}/>
							</div>
						</div>
					</Link>
					<div className="hidden lg:block">
						{/* <Search/> */}
					</div>
				</div>
				<div className="navbar-center hidden lg:flex">
					<Nav urlQuery={urlQuery}/>
				</div>
				<div className="navbar-end">
					<Link href={`${process.env.PUBLIC_URL_DEV}/admin`}>Admin</Link>
					<Link href={`${process.env.PUBLIC_URL_DEV}/api/auth/signout?callbackUrl=/`}>Sign Out</Link>
				</div>
			</div>
		</header>
	);
}
