import Link from "next/link";
import Search from "./search";
import { Post } from "@/types/types";

export default function Header({ allPostsData }: { allPostsData: Array<Post> }) {
	let shortStories: Array<Post> = [];
	let longStories: Array<Post> = [];
	let blogs: Array<Post> = [];
	//TODO: optimize to not use allPostData
	allPostsData.forEach((post) => {
		switch(post.postType) {
			case "short-stories":
				shortStories.push(post);
				break;
			case "long-stories":
				longStories.push(post);
				break;
			default:
				blogs.push(post);
		}
	});

	return (
		<header className="sticky top-0 z-40">
			<div className="justify-between navbar bg-base-100">
				<div className="navbar-start">
					<div className="dropdown">
						<label tabIndex={0} className="btn btn-ghost lg:hidden">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
						</label>
						<ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-300 rounded-box">
							<Search/>
							<li key="longWorks">
								<Link href="/long-stories" className="break-words">Long Works</Link>
								<ul className="p-2">
									{longStories.map(({ title, path }, i) => (
										<li key={i}>
											<Link href={`/long-stories/${path}`} className="break-words">{title}</Link>
										</li>
									))}
								</ul>
							</li>
							<li key="shortWorks">
								<Link href="/short-stories" className="break-words">Short Works</Link>
								<ul className="p-2">
									{shortStories.map(({ title, path }, i) => (
										<li key={i}>
											<Link href={`/short-stories/${path}`} className="break-words">{title}</Link>
										</li>
									))}
								</ul>
							</li>
							<li key="blogs">
								<Link href="/blogs" className="break-words">Blogs</Link>
								<ul className="p-2">
									{blogs.map(({ title, path }, i) => (
										<li key={i}>
											<Link href={`/blogs/${path}`} className="break-words">{title}</Link>
										</li>
									))}
								</ul>
							</li>
						</ul>
					</div>
					<Link className="normal-case text-xl" href="/">
						<div className="avatar">
							<div className="w-20 m-3">
								<img src="/images/profile.png" height={200} width={200}/>
							</div>
						</div>
					</Link>
					<div className="hidden lg:block">
						<Search/>
					</div>
				</div>
				<div className="navbar-center hidden lg:flex">
					{/* make dropdown disappear after clicking */}
					{/* MAYBE make clicking label navigate to link and open dropdown on hover (what to do on mobile?) */}
					<ul className="menu menu-horizontal">
						<li key="longWorks" tabIndex={0} className="dropdown dropdown-hover">
							<label tabIndex={0} className="btn m-1 flex flex-col text-2xl">
								<Link href="/long-stories" className="break-words">Long Works</Link>
							</label>
							<ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box">
								{longStories.map(({ title, path }, i) => (
									<li key={i}>
										<Link href={`/long-stories/${path}`}>{title}</Link>
									</li>
								))}
							</ul>
						</li>
						<li key="shortWorks" tabIndex={0} className="dropdown dropdown-hover">
							<label tabIndex={0} className="btn m-1 flex flex-col text-2xl">
								<Link href="/short-stories" className="break-words">Short Works</Link>
							</label>
							<ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box">
								{shortStories.map(({ title, path }, i) => (
									<li key={i}>
										<Link href={`/short-stories/${path}`}>{title}</Link>
									</li>
								))}
							</ul>
						</li>
						<li key="blogs" tabIndex={0} className="dropdown dropdown-hover">
							<label tabIndex={0} className="btn m-1 flex flex-col text-2xl">
								<Link href="/blogs" className="break-words ">Blogs</Link>
							</label>
							<ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box">
								{blogs.map(({ title, path }, i) => (
									<li key={i}>
										<Link href={`/blogs/${path}`}>{title}</Link>
									</li>
								))}
							</ul>
						</li>
					</ul>
				</div>
				<div className="navbar-end">
					
				</div>
			</div>
		</header>
	);
}