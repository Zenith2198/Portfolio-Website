import { buildURLQuery } from "@/lib/utils";
import Link from "next/link";
import type { Post } from "@/types/types";

export const dynamicParams = false;

export default async function PostType({ params }: { params: { postType: string } }) {
	const urlQuery = buildURLQuery({ sort: [{ sortField: "dateModified" }] });
	const allPostsOfTypeRes = await fetch(`${process.env.PUBLIC_URL_DEV}/api/posts/postTypes/${params.postType}${urlQuery}`);
	const allPostsOfType: Array<Post> = await allPostsOfTypeRes.json();

	return (
		<div>
			{allPostsOfType.map(({ title, path }, i) => (
				<div key={i}>
					<Link href={`/${params.postType}/${path}`} className="break-words">{title}</Link>
				</div>
			))}
		</div>
	);
}

export async function generateStaticParams() {
	const allPostTypesRes = await fetch(`${process.env.PUBLIC_URL_DEV}/api/posts/postTypes`, { cache: 'no-store' });
	const allPostTypes = await allPostTypesRes.json();

	return allPostTypes;
}

export async function generateMetadata({ params }: { params: { postType: string } }) {
	return {
		title: params.postType
	};
}