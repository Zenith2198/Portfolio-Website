import HoverCard from "@/components/HoverCard";
import { buildURLParams } from "@/lib/utils";

export default async function Dashboard() {
	const primaryStoryParams = buildURLParams({
		filter: [{ key: "primaryStory", value: "true" }],
		chapters: [{ whereKey: "chapterNum", whereValue: 1 }]
	});
	const recentShortStoryParams = buildURLParams({
		filter: [{ key: "postTypeId", value: "short-stories" }],
		sort: [{ key: "dateModified", desc: true }],
		take: 1,
		chapters: [{ whereKey: "chapterNum", whereValue: 1 }]
	});
	const recentBlogsParams = buildURLParams({
		filter: [{ key: "postTypeId", value: "blogs" }],
		sort: [{ key: "dateModified", desc: true }],
		take: 4,
		chapters: [{ whereKey: "chapterNum", whereValue: 1 }]
	});

	return (
		<main className="min-w-full">
			<div className="flex flex-col lg:flex-row justify-evenly p-10 min-h-full max-w-full">
				<HoverCard urlParams={primaryStoryParams} />
				<HoverCard urlParams={recentShortStoryParams} />
				<HoverCard urlParams={recentBlogsParams} preview={false} />
			</div>
		</main>
	);
}
