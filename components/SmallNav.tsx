"use client"

import Link from "next/link";
import type { Post } from "@prisma/client";
import useSWR from "swr";
import { fetcher, getBaseUrl, buildURLParams } from "@/lib/utils";
// import Search from "./Search";

export default function SmallNav() {
	const urlParams = buildURLParams({
		fields: [{ key: "title" }, { key: "path" }, { key: "postTypeId" }],
		sort: [{ key: "dateModified", desc: true }]
	});
	const postsRes = useSWR(`${getBaseUrl()}/api/posts${urlParams}`, fetcher, { refreshInterval: 10000 });
	if (postsRes.isLoading) return <div className="lg:hidden">Loading...</div>;
  	if (postsRes.error) return <div className="lg:hidden">Error</div>;
	const posts: Array<Post> = postsRes.data;

	let shortStories: Array<Post> = [];
	let longStories: Array<Post> = [];
	let blogs: Array<Post> = [];
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
			<label tabIndex={0} className="btn btn-ghost lg:hidden">
				<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
			</label>
			<ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
				<li key="longWorks" className="max-w-full">
					<Link href={`${getBaseUrl()}/long-stories`} className="max-w-full">Long Works</Link>
					<ul className="max-w-full">
						{longStories.map(({ title, path }, i) => (
							<li key={i}>
								<Link href={`${getBaseUrl()}/long-stories/${path}`} className="max-w-full">
									<div className="overflow-hidden">{title}</div>
								</Link>
							</li>
						))}
					</ul>
				</li>
				<li key="shortWorks" className="max-w-full">
					<Link href={`${getBaseUrl()}/short-stories`} className="max-w-full">Short Works</Link>
					<ul className="max-w-full">
						{shortStories.map(({ title, path }, i) => (
							<li key={i}>
								<Link href={`${getBaseUrl()}/short-stories/${path}`} className="max-w-full">
									<div className="overflow-hidden">{title}</div>
								</Link>
							</li>
						))}
					</ul>
				</li>
				<li key="blogs" className="max-w-full">
					<Link href={`${getBaseUrl()}/blogs`} className="max-w-full">Blogs</Link>
					<ul className="max-w-full">
						{blogs.map(({ title, path }, i) => (
							<li key={i}>
								<Link href={`${getBaseUrl()}/blogs/${path}`}  className="max-w-full">
									<div className="overflow-hidden">{title}</div>
								</Link>
							</li>
						))}
					</ul>
				</li>
			</ul>
		</div>
	);
}


