import HoverCard from "@/components/HoverCard";
import { postFindMany } from "@/lib/db";
import { fixChaptersArr, buildURLParams } from "@/lib/utils";
import type { PostWithChapters } from "@/types/types.d";

export default async function Dashboard() {
	// const primaryStoryArr = await postFindMany({
	// 	where: {
	// 		primaryStory: true
	// 	},
	// 	include: {
	// 		chapters: {
	// 			where: {
	// 				chapterNum: 1
	// 			}
	// 		}
	// 	}
	// }) as PostWithChapters[];
	const primaryStoryParams = buildURLParams({
		filter: [{ key: "primaryStory", value: "true" }],
		chapters: [{ whereKey: "chapterNum", whereValue: 1 }]
	});
	// const recentShortStoryArr = await postFindMany({
	// 	where: {
	// 		postTypeId: "short-stories"
	// 	},
	// 	orderBy: {
	// 		dateModified: "desc"
	// 	},
	// 	take: 1,
	// 	include: {
	// 		chapters: {
	// 			where: {
	// 				chapterNum: 1
	// 			}
	// 		}
	// 	}
	// }) as PostWithChapters[];
	const recentShortStoryParams = buildURLParams({
		filter: [{ key: "postTypeId", value: "short-stories" }],
		sort: [{ key: "dateModified", desc: true }],
		take: 1,
		chapters: [{ whereKey: "chapterNum", whereValue: 1 }]
	});
	// const recentBlogsArr = await postFindMany({
	// 	where: {
	// 		postTypeId: "blogs"
	// 	},
	// 	orderBy: {
	// 		dateModified: "desc"
	// 	},
	// 	take: 4,
	// 	include: {
	// 		chapters: {
	// 			where: {
	// 				chapterNum: 1
	// 			}
	// 		}
	// 	}
	// }) as PostWithChapters[];
	const recentBlogsParams = buildURLParams({
		filter: [{ key: "postTypeId", value: "blogs" }],
		sort: [{ key: "dateModified", desc: true }],
		take: 4,
		chapters: [{ whereKey: "chapterNum", whereValue: 1 }]
	});
	// if (!primaryStoryArr || !recentShortStoryArr || !recentBlogsArr) return <div>Error</div>;

	// fixChaptersArr(primaryStoryArr);
	// fixChaptersArr(recentShortStoryArr);
	// fixChaptersArr(recentBlogsArr);

	return (
		<main className="min-w-full">
			<div className="flex flex-col lg:flex-row justify-evenly p-10 min-h-full max-w-full">
				<HoverCard urlParams={primaryStoryParams} />
				<HoverCard urlParams={recentShortStoryParams} />
				<HoverCard urlParams={recentBlogsParams} contentLen={100} />
			</div>
		</main>
	);
}
