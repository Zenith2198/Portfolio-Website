import { redirect } from "next/navigation";
import { getBaseUrl } from "@/lib/utils";
import { prisma } from "@/lib/db";

export const dynamicParams = false;

export default async function Post({ params }: { params: { postTypeId: string, path: string } }) {
	let path = params.path;
	if (process.env.NODE_ENV !== "development") {
		path = decodeURIComponent(path)
	}
	const postCount = await prisma.post.findUnique({
		where: {
			path
		},
		select: {
			_count: {
				select: {
					chapters: true
				}
			}
		}
	});
	if (!postCount) return <div>Error</div>;

	if (postCount._count.chapters === 0) {
		return (
			<div className="card bg-base-100 shadow-xl text-9xl p-16 text-center">There is nothing here yet!</div>
		);
    } else if (postCount._count.chapters > 1) {
        redirect(`${getBaseUrl()}/${params.postTypeId}/${params.path}/1`);
    }

	const post = await prisma.post.findUnique({
		where: {
			path
		},
		select: {
			chapters: true
		}
	});
	if (!post) return <div>Error</div>;

	return (
		<div>
			<div className="card bg-base-100 shadow-xl p-10">
				<h1 className="text-5xl pb-5">{post.chapters[0].title}</h1>
				<div className="m-5" dangerouslySetInnerHTML={{ __html: post.chapters[0].content ? post.chapters[0].content : "" }} />
			</div>
		</div>
	);
}