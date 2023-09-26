import { postFindUnique } from "@/lib/db";
import PostSideCard from "@/components/PostSideCard";

// export const dynamicParams = false;

export default async function PostLayout({ children, params }: { children: React.ReactNode, params: { path: string } }) {
	return (
		<div className="flex-1 grid grid-cols-4 gap-5 m-5">
			<PostSideCard path={params.path}/>
			<div className="col-span-3">
				{children}
			</div>
		</div>
	);
}

// export async function generateStaticParams({ params }: { params: { postTypeId: string } }) {
// 	let allPosts = [];

// 	const allPaths = await prisma.postType.findUnique({
// 		where: {
// 			postTypeId: params.postTypeId
// 		},
// 		select: {
// 			posts: {
// 				select: {
// 					path: true
// 				}
// 			}
// 		}
// 	});

// 	if (allPaths) {
// 		for (const { path } of allPaths.posts) {
// 			allPosts.push({
// 				path
// 			});
// 		}
// 	}

// 	return allPosts;
// }

export async function generateMetadata({ params }: { params: { path: string } }) {
	const post = await postFindUnique({
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