import { buildURLQuery } from "@/lib/utils";
import type { Chapter } from "@/types/types"

export const dynamicParams = false;

export default async function Post({ params }: { params: { postType: string, path: string } }) {
	const postDataRes = await fetch(`${process.env.PUBLIC_URL_DEV}/api/posts/${params.path}`);
	const postData = await postDataRes.json();

	return (
		<div>
			<h1 className='text-5xl'>{postData.title}</h1>
			<div>{postData.datePosted}</div>
			<div>Last modified: {postData.dateModified}</div>
			<div className='m-20'>
				{postData.chapters.map((chapter: Chapter) => (
					<div key={chapter.chapterNum}>
						<h2 className='text-2xl'>{chapter.title}</h2>
						<div>{chapter.datePosted}</div>
						<div>Last modified: {chapter.dateModified}</div>
						<div className='m-20' dangerouslySetInnerHTML={{ __html: chapter.content }} />
					</div>
				))}
			</div>
		</div>
	);
}

export async function generateStaticParams() {
	let allPosts = [];

	const allPostTypesRes = await fetch(`${process.env.PUBLIC_URL_DEV}/api/posts/postTypes`, { cache: 'no-store' }); //TODO: remove caching
	const allPostTypes = await allPostTypesRes.json();

	for (const { postType } of allPostTypes) {
		const urlQuery = buildURLQuery({ fields: ["path"] });
		const allPathsRes = await fetch(`${process.env.PUBLIC_URL_DEV}/api/posts/postTypes/${postType}${urlQuery}`);
		const allPaths = await allPathsRes.json();

		for (const { path } of allPaths) {
			allPosts.push({
				postType,
				path
			});
		}
	}
	return allPosts;
}

export async function generateMetadata({ params }: { params: { postType: string, path: string } }) {
	const urlQuery = buildURLQuery({ fields: ["title"] });
	const postTitleRes = await fetch(`${process.env.PUBLIC_URL_DEV}/api/posts/${params.path}${urlQuery}`);
	const postTitle = await postTitleRes.json();

	return {
		title: postTitle.title
	};
}