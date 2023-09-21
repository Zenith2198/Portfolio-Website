import { buildURLParams } from "@/lib/utils";
import Image from "next/image";

export default async function PostLayout({ children, params }: { children: React.ReactNode, params: { path: string, chapterNum: string } }) {
	const postDataRes = await fetch(`${process.env.PUBLIC_URL_DEV}/api/posts/${params.path}`);
	const postData = await postDataRes.json();

	return (
		<div className="flex-1 grid grid-cols-4 gap-5 m-5">
			<div>
				<div className="card lg:card-side bg-base-100 shadow-xl">
					<figure><Image src={postData.image} alt="" className="object-contain max-h-[32rem]" /></figure>
					<div className="card-body justify-center">
						<h2 className="card-title">{postData.title}</h2>
						<h1 className="text-info text-xl pb-2 mb-5">
							{postData.dateModified}
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

export async function generateStaticParams({ params }: { params: { postType: string } }) {
	let allPosts = [];

	const urlQuery = buildURLParams({ fields: ["path"] });
	const allPathsRes = await fetch(`${process.env.PUBLIC_URL_DEV}/api/posts/postTypes/${params.postType}${urlQuery}`);
	const allPaths = await allPathsRes.json();

	for (const { path } of allPaths) {
		allPosts.push({
			path
		});
	}

	return allPosts;
}

export async function generateMetadata({ params }: { params: { path: string } }) {
	const postDataRes = await fetch(`${process.env.PUBLIC_URL_DEV}/api/posts/${params.path}`);
	const postData = await postDataRes.json();

	return {
		title: postData.title
	};
}