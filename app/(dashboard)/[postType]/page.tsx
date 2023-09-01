import { getAllPostTypes, getSortedOfPostTypeNoChapters } from "@/app/api/lib/db";
import Link from "next/link";

export const dynamicParams = false;

export default async function PostType({ params }: { params: { postType: string } }) {
	let posts = await getSortedOfPostTypeNoChapters(params.postType);
	return (
		<div>
			{posts.map(({ title, path }, i) => (
				<div key={i}>
					<Link href={`/${params.postType}/${path}`} className="break-words">{title}</Link>
				</div>
			))}
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