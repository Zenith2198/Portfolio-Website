import HoverCard from "@/components/HoverCard";
import { prisma } from "@/lib/db";
import { fixChaptersArr } from "@/lib/utils";
import type { PostWithChapters } from "@/types/types.d";

export default async function Dashboard() {
	const primaryStoryArr = await prisma.post.findMany({
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
	}) as unknown as PostWithChapters[];
	const recentShortStoryArr = await prisma.post.findMany({
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
	}) as unknown as PostWithChapters[];
	const recentBlogsArr = await prisma.post.findMany({
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
	}) as unknown as PostWithChapters[];
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
