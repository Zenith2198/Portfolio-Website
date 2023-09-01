//@ts-nocheck

import type { Metadata } from "next";
import { getPrimaryStory, getRecentsOfPostType } from "@/app/api/lib/db";
import HoverCard from "@/components/HoverCard";

export let metadata: Metadata = {
	title: "Paig's Bog",
	description: "",
}

export default async function Dashboard() {
	let primaryStoryArr = await getPrimaryStory();
	let recentShortStoryArr = await getRecentsOfPostType("short-stories");
	let recentBlogs = await getRecentsOfPostType("blogs", 2);
	console.log(recentBlogs)

	return (
		<main className="min-w-full">
			<div className="flex flex-col lg:flex-row justify-evenly p-10 min-h-full max-w-full">
				<HoverCard posts={primaryStoryArr}/>
				<HoverCard posts={recentShortStoryArr}/>
				<HoverCard posts={recentBlogs}/>
			</div>
		</main>
	);
}
