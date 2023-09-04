import Link from "next/link";
import { smartTrim } from "@/lib/utils";
import type { Post } from "@/types/types"

export default function HoverCard({ posts, contentLen = 500 }: { posts: Array<Post>, contentLen?: number }) {
	return (
		<div className="card w-96 bg-neutral text-primary-content max-w-full items-stretch overflow-hidden">
			{posts.map((post, i) => (
				<Link href={`/${post.postType}/${post.path}`} key={i} className="card-body p-0 relative border-base-300 [&:not(:first-child)]:border-t [&:not(:last-child)]:border-b h-full group">
					<div className="h-full flex flex-col">
						<div className="card-body pb-5 transition duration-300 ease-in-out group-hover:opacity-0">
							<h2 className="card-title flex justify-center">{post.title}</h2>
						</div>
						<div className="bg-cover bg-no-repeat bg-center h-full" style={{backgroundImage: `url(${post?.image || ""})`}}></div>
					</div>
					<div className={`card px-10 py-5 absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-black bg-fixed opacity-0 transition duration-300 ease-in-out group-hover:opacity-[90%] ${i!==posts.length-1?"rounded-b-none":""} ${i!==0?"rounded-t-none":""}`}>
						<h1 className="text-info text-xl pb-2 mb-5 border-default border-b-2">
							{post.dateModified}
						</h1>
						<div className="text-2xl">{post.chapters[0]?.title}</div>
						<div dangerouslySetInnerHTML={{__html: smartTrim(post.chapters[0]?.content, contentLen)}}>
							{/* {`${smartTrim(post.chapters[0].content, contentLen)}...`} */}
						</div>
					<h1 className="text-info text-3xl text-center pt-2">
						Read More
					</h1>
				</div>
				</Link>
			))}
		</div>
	);
}