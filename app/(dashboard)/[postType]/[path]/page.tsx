import { getAllPostTypes, getAllPaths, getPostData, getPostTitle } from "@/app/api/lib/db";
import type { Chapter } from "@/types/types"

export const dynamicParams = false;

export default async function Post({ params }: { params: { postType: string, path: string } }) {
	const postData = await getPostData(params.path);

	return (
		<div>
			<h1 className='text-5xl'>{postData.title}</h1>
			<div>{postData.datePosted}</div>
			<div>Last modified: {postData.dateModified}</div>
			<div className='m-20'>
				{postData.chapters.map((chapter: Chapter) =>(
					<div key={chapter.chapterNum}>
						<h2 className='text-2xl'>{chapter.title}</h2>
						<div className='m-20' dangerouslySetInnerHTML={{__html: chapter.content}}/>
					</div>
				))}
			</div>
		</div>
	);
}

export async function generateStaticParams() {
	let allPosts = [];
	const allPostTypes = await getAllPostTypes();
	for (const postType of allPostTypes) {
		const allPaths =  await getAllPaths(postType);
		for (const path of allPaths) {
			allPosts.push({
				postType: postType,
				path: path
			});
		}
	}
	return allPosts;
}

export async function generateMetadata({ params }: { params: { postType: string, path: string } }) {
	const postTitle = await getPostTitle(params.path);
	return {
		title: postTitle.title
	};
}