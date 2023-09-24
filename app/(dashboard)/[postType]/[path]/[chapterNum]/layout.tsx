import type { Chapter } from "@prisma/client";
import { buildURLParams } from "@/lib/utils";

export default function PostLayout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			{children}
		</div>
	);
}

export async function generateStaticParams({ params }: { params: { path: string } }) {
	let allChapters = [];

	const urlQuery = buildURLParams({ fields: ["chapters"] });
	const postDataRes = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/posts/${params.path}?${urlQuery}`);
	if (!postDataRes.ok) return <div>Error</div>;
	const postData = await postDataRes.json();

	if (postData.chapters.length === 0) {
		allChapters.push({
			chapterNum: "0"
		});
	} else {
		postData.chapters.forEach((chapter: Chapter) => {
			allChapters.push({
				chapterNum: chapter.chapterNum.toString()
			});
		});
	}

	return allChapters;
}

export async function generateMetadata({ params }: { params: { chapterNum: string } }) {
	return {
		title: params.chapterNum
	};
}