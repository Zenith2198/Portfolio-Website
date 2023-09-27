"use client"

import Link from "next/link";
import type { Post } from "@prisma/client";
import useSWR from "swr";
import { fetcher, getBaseUrl, buildURLParams } from "@/lib/utils";

export default function Nav() {
	const urlParams = buildURLParams({
		fields: [{ key: "title" }, { key: "path" }, { key: "postTypeId" }],
		sort: [{ key: "dateModified", desc: true }]
	});
	const postsRes = useSWR(`${getBaseUrl()}/api/posts${urlParams}`, fetcher, { refreshInterval: 10000 });
	if (postsRes.isLoading) {
		return (
			<div className="menu menu-horizontal">
				<span className="loading loading-ring loading-lg min-w-[50%]"></span>
			</div>
		);
	}
  	if (postsRes.error) {
		return (
			<div className="menu menu-horizontal">
				Error
			</div>
		);
	}
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
		<ul className="menu menu-horizontal">
			<li onClick={unfocus} key="longWorks" className="dropdown dropdown-hover">
				<label className="btn m-1 flex flex-col text-2xl">
					<Link href={`${getBaseUrl()}/long-stories`} className="break-words">Long Works</Link>
				</label>
				<ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box">
					{longStories.map(({ title, path }, i) => (
						<li onClick={unfocus} key={i}>
							<Link href={`${getBaseUrl()}/long-stories/${path}`}>{title}</Link>
						</li>
					))}
				</ul>
			</li>
			<li onClick={unfocus} key="shortWorks" className="dropdown dropdown-hover">
				<label className="btn m-1 flex flex-col text-2xl">
					<Link href={`${getBaseUrl()}/short-stories`} className="break-words">Short Works</Link>
				</label>
				<ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box">
					{shortStories.map(({ title, path }, i) => (
						<li onClick={unfocus} key={i}>
							<Link href={`${getBaseUrl()}/short-stories/${path}`}>{title}</Link>
						</li>
					))}
				</ul>
			</li>
			<li onClick={unfocus} key="blogs" className="dropdown dropdown-hover">
				<label className="btn m-1 flex flex-col text-2xl">
					<Link href={`${getBaseUrl()}/blogs`} className="break-words ">Blogs</Link>
				</label>
				<ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box">
					{blogs.map(({ title, path }, i) => (
						<li onClick={unfocus} key={i}>
							<Link href={`${getBaseUrl()}/blogs/${path}`}>{title}</Link>
						</li>
					))}
				</ul>
			</li>
		</ul>
	);
}
