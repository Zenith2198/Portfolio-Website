import { getBaseUrl, buildURLParams } from "@/lib/utils";
import Link from "next/link";
import type { Post } from "@prisma/client";

export const dynamicParams = false;

export default async function PostTypeId({ params }: { params: { postTypeId: string } }) {
	const urlQuery = buildURLParams({ sort: [{ sortField: "dateModified", desc: true }] });
	const allPostsOfTypeRes = await fetch(`${getBaseUrl()}/api/posts/postTypes/${params.postTypeId}?${urlQuery}`); 
	if (!allPostsOfTypeRes.ok) return <div>Error</div>;
	const allPostsOfType: Array<Post> = await allPostsOfTypeRes.json();

	return (
		<div>
			{allPostsOfType.map(({ title, path }, i) => (
				<div key={i}>
					<Link href={`${getBaseUrl()}/${params.postTypeId}/${path}`} className="break-words">{title}</Link>
				</div>
			))}
		</div>
	);
}