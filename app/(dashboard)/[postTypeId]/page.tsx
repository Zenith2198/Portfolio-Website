import { getBaseUrl } from "@/lib/utils";
import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function PostTypeId({ params }: { params: { postTypeId: string } }) {
	const allPostsOfType = await prisma.post.findMany({
		where: {
			postTypeId: params.postTypeId
		},
		select: {
			path: true,
			title: true
		}
	});
	if (!allPostsOfType) return <div>Error</div>;

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