"use client"

import Link from "next/link";
import type { Post } from "@prisma/client";
import useSWR from "swr";
import { getBaseUrl, fetcher } from "@/lib/utils";
// import Search from "./Search";

export default function SmallNav({ posts }: { posts: Post[] }) {
	let shortStories: Array<Post> = [];
	let longStories: Array<Post> = [];
	let blogs: Array<Post> = [];
	// TODO: optimize to not use allPostData
	posts.forEach((post: Post) => {
		switch(post.postTypeId) {
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
		<div className="dropdown">
			<label className="btn btn-ghost lg:hidden">
				<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
			</label>
			<ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-300 rounded-box">
				{/* <Search/> */}
				<li key="longWorks">
					<Link href={`${getBaseUrl()}/long-stories`} className="break-words">Long Works</Link>
					<ul className="p-2">
						{longStories.map(({ title, path }, i) => (
							<li key={i}>
								<Link href={`${getBaseUrl()}/long-stories/${path}`} className="break-words">{title}</Link>
							</li>
						))}
					</ul>
				</li>
				<li key="shortWorks">
					<Link href={`${getBaseUrl()}/short-stories`} className="break-words">Short Works</Link>
					<ul className="p-2">
						{shortStories.map(({ title, path }, i) => (
							<li key={i}>
								<Link href={`${getBaseUrl()}/short-stories/${path}`} className="break-words">{title}</Link>
							</li>
						))}
					</ul>
				</li>
				<li key="blogs">
					<Link href={`${getBaseUrl()}/blogs`} className="break-words">Blogs</Link>
					<ul className="p-2">
						{blogs.map(({ title, path }, i) => (
							<li key={i}>
								<Link href={`${getBaseUrl()}/blogs/${path}`} className="break-words">{title}</Link>
							</li>
						))}
					</ul>
				</li>
			</ul>
		</div>
	);
}
