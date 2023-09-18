import type { Metadata } from "next";
import { buildURLParams } from "@/lib/utils";
import type { Post } from "@/types/types";
import HoverCard from "@/components/HoverCard";

export let metadata: Metadata = {
	title: "Paig's Bog",
	description: "",
}

export default async function Dashboard() {
	const primaryStoryQuery = buildURLParams({ filter: [{ filterField: "primaryStory", filterValue: "1" }], chapters: true });
	const primaryStoryRes = await fetch(`${process.env.PUBLIC_URL_DEV}/api/posts${primaryStoryQuery}`, { cache: 'no-store' }); //TODO: remove caching
	const primaryStoryArr: Array<Post> = await primaryStoryRes.json();

	const recentShortStoryQuery = buildURLParams({ sort: [{ sortField: "dateModified", desc: true, limit: 1 }], chapters: true });
	const recentShortStoryRes = await fetch(`${process.env.PUBLIC_URL_DEV}/api/posts/postTypes/short-stories${recentShortStoryQuery}`, { cache: 'no-store' }); //TODO: remove caching
	const recentShortStoryArr: Array<Post> = await recentShortStoryRes.json();

	const recentBlogsQuery = buildURLParams({ sort: [{ sortField: "dateModified", desc: true, limit: 4 }], chapters: true });
	const recentBlogsRes = await fetch(`${process.env.PUBLIC_URL_DEV}/api/posts/postTypes/blogs${recentBlogsQuery}`, { cache: 'no-store' }); //TODO: remove caching
	const recentBlogsArr: Array<Post> = await recentBlogsRes.json();

	return (
		<main className="min-w-full">
			<div className="flex flex-col lg:flex-row justify-evenly p-10 min-h-full max-w-full">
				<HoverCard posts={primaryStoryArr} />
				<HoverCard posts={recentShortStoryArr} />
				<HoverCard posts={recentBlogsArr} contentLen={100} />
			</div>
		</main>
	);
}
