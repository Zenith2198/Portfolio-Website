import { buildURLParams } from "@/lib/utils";

export default async function PostLayout({ children, params }: { children: React.ReactNode, params: { path: string, chapterNum: string } }) {
	const postDataRes = await fetch(`${process.env.PUBLIC_URL_DEV}/api/posts/${params.path}`);
	const postData = await postDataRes.json();

	return (
		<div>
			<h1 className='text-5xl'>{postData.title}</h1>
			<div>{postData.datePosted}</div>
			<div>Last modified: {postData.dateModified}</div>
			{children}
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