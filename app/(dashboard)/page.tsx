import HoverCard from "@/components/HoverCard";
import { postFindMany } from "@/lib/db";
import { fixChaptersArr } from "@/lib/utils";
import type { PostWithChapters } from "@/types/types.d";

const dynamic = 'force-dynamic'

export default async function Dashboard() {
	const primaryStoryArr = await postFindMany({
		where: {
			primaryStory: true
		},
		include: {
			chapters: {
				where: {
					chapterNum: 1
				}
			}
		}
	}) as PostWithChapters[];
	const recentShortStoryArr = await postFindMany({
		where: {
			postTypeId: "short-stories"
		},
		orderBy: {
			dateModified: "desc"
		},
		take: 1,
		include: {
			chapters: {
				where: {
					chapterNum: 1
				}
			}
		}
	}) as PostWithChapters[];
	const recentBlogsArr = await postFindMany({
		where: {
			postTypeId: "blogs"
		},
		orderBy: {
			dateModified: "desc"
		},
		take: 4,
		include: {
			chapters: {
				where: {
					chapterNum: 1
				}
			}
		}
	}) as PostWithChapters[];
	if (!primaryStoryArr || !recentShortStoryArr || !recentBlogsArr) return <div>Error</div>;

	fixChaptersArr(primaryStoryArr);
	fixChaptersArr(recentShortStoryArr);
	fixChaptersArr(recentBlogsArr);

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
