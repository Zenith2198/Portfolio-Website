import { prisma } from "@/lib/db";

export default function PostLayout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			{children}
		</div>
	);
}

export async function generateStaticParams({ params }: { params: { path: string } }) {
	let allChapters = [];

	const post = await prisma.post.findUnique({
		where: {
			path: params.path
		},
		select: {
			chapters: {
				select: {
					chapterNum: true
				}
			}
		}
	});

	if (post && post.chapters.length === 0) {
		allChapters.push({
			chapterNum: "0"
		});
	} else {
		post?.chapters.forEach((chapter) => {
			allChapters.push({
				chapterNum: chapter.chapterNum.toString()
			});
		});
	}

	return allChapters;
}

export async function generateMetadata({ params }: { params: { path: string, chapterNum: string } }) {
	let path = params.path;
	if (process.env.NODE_ENV !== "development") {
		path = decodeURIComponent(params.path);
	}
	const post = await prisma.post.findUnique({
		where: {
			path
		},
		select: {
			title: true
		}
	});

	return {
		title: post?.title + ": " + params.chapterNum
	};
}