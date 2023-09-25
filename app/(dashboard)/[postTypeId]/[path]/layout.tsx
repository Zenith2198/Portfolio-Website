import { fixDate } from "@/lib/utils";
import { prisma } from "@/lib/db";
import Image from "next/image";

export default async function PostLayout({ children, params }: { children: React.ReactNode, params: { path: string, chapterNum: string } }) {
	const post = await prisma.post.findUnique({
		where: {
			path: params.path
		}
	});
	if (!post) return <div>Error</div>;

	return (
		<div className="flex-1 grid grid-cols-4 gap-5 m-5">
			<div>
				<div className="card lg:card-side bg-base-100 shadow-xl">
					{post.imageLink ? 
						<figure><Image src={post.imageLink} alt="" fill={true} className="object-contain max-h-[32rem]" /></figure>
					: <div></div>
					}
					<div className="card-body justify-center">
						<h2 className="card-title">{post?.title}</h2>
						<h1 className="text-info text-xl pb-2 mb-5">
							{fixDate(post.dateModified)}
						</h1>
					</div>
				</div>
			</div>
			<div className="col-span-3">
				{children}
			</div>
		</div>
	);
}

export async function generateStaticParams({ params }: { params: { postTypeId: string } }) {
	let allPosts = [];

	const posts = await prisma.post.findMany({
		where: {
			postTypeId: params.postTypeId
		},
		select: {
			path: true
		}
	});

	if (posts) {
		for (const { path } of posts) {
			allPosts.push({
				path
			});
		}
	}

	return allPosts;
}

export async function generateMetadata({ params }: { params: { path: string } }) {
	const post = await prisma.post.findUnique({
		where: {
			path: params.path
		},
		select: {
			title: true
		}
	});

	return {
		title: post?.title
	};
}