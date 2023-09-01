import Link from "next/link";
import SmallNav from "./smallNav";
import Nav from "./nav";
// import Search from "./search";

export default function Header() {
	return (
		<header className="sticky top-0 z-40">
			<div className="justify-between navbar bg-base-100">
				<button id="skipNav" className="w-0 h-0"></button>
				<div className="navbar-start">
					<SmallNav/>
					<Link className="normal-case text-xl" href="/">
						<div className="avatar">
							<div className="w-20 m-3">
								<img src="/images/profile.png" height={200} width={200}/>
							</div>
						</div>
					</Link>
					<div className="hidden lg:block">
						{/* <Search/> */}
					</div>
				</div>
				<div className="navbar-center hidden lg:flex">
					<Nav/>
				</div>
				<div className="navbar-end">
					<Link href="/admin">Admin</Link>
					<Link href="/api/auth/signout?callbackUrl=/">Sign Out</Link>
				</div>
			</div>
		</header>
	);
}