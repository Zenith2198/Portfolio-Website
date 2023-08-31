import Link from "next/link";
import { smartTrim } from "@/lib/utils";
import type { Post } from "@/types/types"

export default function HoverCard({ post, className="" }: { post: Post, className?: string }) {
	return (
		<Link href={`/short-stories/${post.path}`} className={`card-body relative ${className}`}>
			<div className="card-title flex justify-center text-center transition duration-300 ease-in-out group-hover:opacity-0">
				<h2>{post.title}</h2>
			</div>
			<div className="card px-10 py-5 absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-black bg-fixed opacity-0 transition duration-300 ease-in-out group-hover:opacity-50">
				<h1 className="text-info text-xl pb-2 mb-5 border-default border-b-2">
					{post.dateModified}
				</h1>
				<div>
					{`${smartTrim(post.content, 500)}...`}
				</div>
				<h1 className="text-info text-3xl text-center pt-10">
					Read More
				</h1>
			</div>
		</Link>
	);
}