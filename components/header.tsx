"use client"

import Link from "next/link";
// import Search from "./search";
import type { Post } from "@/types/types";

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

	function __unfocus() {
		const el = document.getElementById("skipNav");
		if (el) {
		  	el.focus();
			el.blur();
		}
	}

	function unfocus() {
		__unfocus();
	}

	return (
		<header className="sticky top-0 z-40">
			<div className="justify-between navbar bg-base-100">
				<button id="skipNav" className="w-0 h-0"></button>
				<div className="navbar-start">
					<div className="dropdown">
						<label className="btn btn-ghost lg:hidden">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
						</label>
						<ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-300 rounded-box">
							{/* <Search/> */}
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
						{/* <Search/> */}
					</div>
				</div>
				<div className="navbar-center hidden lg:flex">
					<ul className="menu menu-horizontal">
						<li onClick={unfocus} key="longWorks" className="dropdown dropdown-hover">
							<label className="btn m-1 flex flex-col text-2xl">
								<Link href="/long-stories" className="break-words">Long Works</Link>
							</label>
							<ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box">
								{longStories.map(({ title, path }, i) => (
									<li onClick={unfocus} key={i}>
										<Link href={`/long-stories/${path}`}>{title}</Link>
									</li>
								))}
							</ul>
						</li>
						<li onClick={unfocus} key="shortWorks" className="dropdown dropdown-hover">
							<label className="btn m-1 flex flex-col text-2xl">
								<Link href="/short-stories" className="break-words">Short Works</Link>
							</label>
							<ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box">
								{shortStories.map(({ title, path }, i) => (
									<li onClick={unfocus} key={i}>
										<Link href={`/short-stories/${path}`}>{title}</Link>
									</li>
								))}
							</ul>
						</li>
						<li onClick={unfocus} key="blogs" className="dropdown dropdown-hover">
							<label className="btn m-1 flex flex-col text-2xl">
								<Link href="/blogs" className="break-words ">Blogs</Link>
							</label>
							<ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box">
								{blogs.map(({ title, path }, i) => (
									<li onClick={unfocus} key={i}>
										<Link href={`/blogs/${path}`}>{title}</Link>
									</li>
								))}
							</ul>
						</li>
					</ul>
				</div>
				<div className="navbar-end">
					<Link href="/admin">Admin</Link>
					<Link href="/api/auth/signout?callbackUrl=/">Sign Out</Link>
				</div>
			</div>
		</header>
	);
}