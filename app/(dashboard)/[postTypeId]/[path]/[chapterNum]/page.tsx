import { prisma } from "@/lib/db";
import ChapterNav from "@/components/ChapterNav";

export const dynamicParams = false;

export default async function Chapter({ params }: { params: { path: string, chapterNum: string } }) {
	let path = params.path;
	if (process.env.NODE_ENV !== "development") {
		path = decodeURIComponent(params.path);
	}
	const post = await prisma.post.findUnique({
		where: {
			path
		},
		select: {
			chapters: {
				where: {
					chapterNum: Number(params.chapterNum)
				}
			}
		}
	});
	if (!post) return <div>Error</div>;

	return (
		<div>
			<ChapterNav path={path} chapterNum={params.chapterNum}/>
			<div className="card bg-base-100 shadow-xl p-10 my-3">
				<h1 className="text-5xl pb-5">{post.chapters[0].title}</h1>
				<div className="m-5" dangerouslySetInnerHTML={{ __html: post.chapters[0].content ? post.chapters[0].content : "" }} />
			</div>
			<ChapterNav className="dropdown-top" path={path} chapterNum={params.chapterNum}/>
		</div>
	);
}