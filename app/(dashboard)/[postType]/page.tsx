import { buildURLParams } from "@/lib/utils";
import Link from "next/link";
import type { Post } from "@/types/types";

export const dynamicParams = false;

export default async function PostType({ params }: { params: { postType: string } }) {
	const urlQuery = buildURLParams({ sort: [{ sortField: "dateModified", desc: true }] });
	const allPostsOfTypeRes = await fetch(`${process.env.PUBLIC_URL_DEV}/api/posts/postTypes/${params.postType}${urlQuery}`, { cache: 'no-store' }); //TODO: remove caching
	const allPostsOfType: Array<Post> = await allPostsOfTypeRes.json();

	return (
		<div>
			{allPostsOfType.map(({ title, path }, i) => (
				<div key={i}>
					<Link href={`${process.env.PUBLIC_URL_DEV}/${params.postType}/${path}`} className="break-words">{title}</Link>
				</div>
			))}
		</div>
	);
}