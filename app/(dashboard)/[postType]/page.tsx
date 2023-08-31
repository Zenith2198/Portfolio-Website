import { getAllPostTypes } from "@/lib/db";

export const dynamicParams = false;

export default async function PostType({ params }: { params: { postType: string } }) {
	return (
		<div>
			Post type: {params.postType}
		</div>
	);
}

export async function generateStaticParams() {
	const allPostTypes = await getAllPostTypes();
	return allPostTypes;
}

export async function generateMetadata({ params }: { params: { postType: string } }) {
	return {
		title: params.postType
	};
}