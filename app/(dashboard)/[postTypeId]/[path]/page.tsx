import { redirect } from "next/navigation";
import { getBaseUrl, fixChapters } from "@/lib/utils";
import { postFindUnique } from "@/lib/db";
import type { PostWithChapters, PostWithChaptersCount } from "@/types/types.d";

export default async function Post({ params }: { params: { postTypeId: string, path: string } }) {
	let path = params.path;
	if (process.env.NODE_ENV !== "development") {
		path = decodeURIComponent(params.path);
	}
	const chaptersCount = await postFindUnique({
		where: {
			path: params.path
		},
		select: {
			_count: {
				select: {
					chapters: true
				}
			}
		}
	}) as PostWithChaptersCount;
	if (!chaptersCount) return <div>Error1 {path} {params.path}</div>;

	if (chaptersCount._count.chapters === 0) {
		return (
			<div className="card bg-base-100 shadow-xl text-9xl p-16 text-center">There is nothing here yet!</div>
		);
    } else if (chaptersCount._count.chapters > 1) {
        redirect(`${getBaseUrl()}/${params.postTypeId}/${params.path}/1`);
    }

	const post = await postFindUnique({
		where: {
			path
		},
		select: {
			chapters: true
		}
	}) as PostWithChapters;
	if (!post) return <div>Error2</div>;

	fixChapters(post);

	return (
		<div>
			<div className="card bg-base-100 shadow-xl p-10">
				<h1 className="text-5xl pb-5">{post.chapters[0].title}</h1>
				<div className="m-5" dangerouslySetInnerHTML={{ __html: post.chapters[0].content ? post.chapters[0].content : "" }} />
			</div>
		</div>
	);
}