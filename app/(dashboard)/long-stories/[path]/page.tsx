import { getAllPaths, getPostData, getPostTitle } from "@/lib/posts";

export const dynamicParams = false;

export default async function LongStories({ params }: { params: { path: string } }) {
	const postData = await getPostData(params.path);

	return (
		<div>
			<h1 className='text-5xl'>{postData.title}</h1>
			<div>{postData.date}</div>
			<div className='m-20'>
				<div className='m-20' dangerouslySetInnerHTML={{__html: postData.content}}/>
			</div>
		</div>
	);
}

export async function generateStaticParams() {
	const allPaths = await getAllPaths("longStories");
	return allPaths;
}

export async function generateMetadata({ params }: { params: { path: string } }) {
	const postTitle = await getPostTitle(params.path);
	return {
		title: postTitle.title
	};
}