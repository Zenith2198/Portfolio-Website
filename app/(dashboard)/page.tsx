import { buildURLParams } from "@/lib/utils";
import type { PostWithChapters } from "@/types/types";
import HoverCard from "@/components/HoverCard";
import { getBaseUrl } from "@/lib/utils";

export default async function Dashboard() {
	// const primaryStoryQuery = buildURLParams({ filter: [{ filterField: "primaryStory", filterValue: "true" }], chapters: true });
	// const primaryStoryRes = await fetch(`${getBaseUrl()}/api/posts?${primaryStoryQuery}`); 
	// const recentShortStoryQuery = buildURLParams({ sort: [{ sortField: "dateModified", desc: true }], take: 1, chapters: true });
	// const recentShortStoryRes = await fetch(`${getBaseUrl()}/api/posts/postTypes/short-stories?${recentShortStoryQuery}`); 
	// const recentBlogsQuery = buildURLParams({ sort: [{ sortField: "dateModified", desc: true }], take: 4, chapters: true });
	// const recentBlogsRes = await fetch(`${getBaseUrl()}/api/posts/postTypes/blogs?${recentBlogsQuery}`);

	// if (!primaryStoryRes.ok || !recentShortStoryRes.ok || !recentBlogsRes.ok) return <div>Error</div>;

	// const primaryStoryArr: Array<PostWithChapters> = await primaryStoryRes.json();
	// const recentShortStoryArr: Array<PostWithChapters> = await recentShortStoryRes.json();
	// const recentBlogsArr: Array<PostWithChapters> = await recentBlogsRes.json();

	return (
		<main className="min-w-full">
			<div className="flex flex-col lg:flex-row justify-evenly p-10 min-h-full max-w-full">
				{/* <HoverCard posts={primaryStoryArr} />
				<HoverCard posts={recentShortStoryArr} />
				<HoverCard posts={recentBlogsArr} contentLen={100} /> */}
			</div>
		</main>
	);
}
