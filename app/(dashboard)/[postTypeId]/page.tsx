import { getBaseUrl } from "@/lib/utils";
import Link from "next/link";
import { postFindMany } from "@/lib/db";

export default async function PostTypeId({ params }: { params: { postTypeId: string } }) {
	const allPostsOfType = await postFindMany({
		where: {
			postTypeId: params.postTypeId
		},
		select: {
			path: true,
			title: true
		}
	});
	if (!allPostsOfType) return <div>Error {params.postTypeId}</div>;

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