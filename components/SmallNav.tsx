import Link from "next/link";
import type { Post } from "@prisma/client";
import { getBaseUrl, buildURLParams } from "@/lib/utils";
// import Search from "./Search";

export default async function SmallNav() {
	const urlParams = buildURLParams({
		fields: [{ fieldKey: "title" }, { fieldKey: "path" }, { fieldKey: "postTypeId" }],
		sort: [{ sortKey: "dateModified", desc: true }]
	});
	const postsRes = await fetch(`${getBaseUrl()}/api/posts${urlParams}`, { next: { revalidate: 1 } });
	if (!postsRes.ok) throw new Error('Failed to fetch data');
	const posts: Array<Post> = await postsRes.json();

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


