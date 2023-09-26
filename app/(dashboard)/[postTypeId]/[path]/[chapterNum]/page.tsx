import { postFindUnique } from "@/lib/db";
import ChapterNav from "@/components/ChapterNav";
import { fixChapters } from "@/lib/utils";
import type { PostWithChapters } from "@/types/types.d";

export default async function Chapter({ params }: { params: { path: string, chapterNum: string } }) {
	// let path = params.path;
	// if (process.env.NODE_ENV !== "development") {
	// 	path = decodeURIComponent(params.path);
	// }
	const post = await postFindUnique({
		where: {
			path: params.path
		},
		select: {
			chapters: {
				where: {
					chapterNum: Number(params.chapterNum)
				}
			}
		}
	}) as PostWithChapters;
	if (!post) return <div>Failed to load Chapter</div>;

	fixChapters(post);

	return (
		<div>
			<ChapterNav path={params.path} chapterNum={params.chapterNum}/>
			<div className="card bg-base-100 shadow-xl p-10 my-3">
				<h1 className="text-5xl pb-5">{post.chapters[0].title}</h1>
				<div className="m-5" dangerouslySetInnerHTML={{ __html: post.chapters[0].content ? post.chapters[0].content : "" }} />
			</div>
			<ChapterNav className="dropdown-top" path={params.path} chapterNum={params.chapterNum}/>
		</div>
	);
}