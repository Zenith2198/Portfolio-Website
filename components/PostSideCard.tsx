import { fixDate } from "@/lib/utils";
import { postFindUnique } from "@/lib/db";
import Image from "next/image";

export default async function PostSideCard({ path }: { path: string }) {
	// if (process.env.NODE_ENV !== "development") {
	// 	path = decodeURIComponent(path);
	// }
	const post = await postFindUnique({
		where: {
			path
		}
	});

	if (!post) return <div>Failed to load PostSideCard</div>;
	
	return (
		<div>
			<div className="card lg:card-side bg-base-100 shadow-xl">
				{post.imageLink ?
					<figure><Image src={post.imageLink} alt="" className="object-contain max-h-lg" width={512} height={100} /></figure>
				: <div></div>
				}
				<div className="card-body">
					<h2 className="card-title">{post?.title}</h2>
					<h1 className="text-info text-xl pb-2 mb-5">{fixDate(post.dateModified)}</h1>
				</div>
			</div>
		</div>
	);
}