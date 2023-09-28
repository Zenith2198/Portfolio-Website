"use client"

import Link from "next/link";
import type { PostWithChapters } from "@/types/types.d";
import useSWR from "swr";
import { getBaseUrl, fixDate, smartTrim, fetcher } from "@/lib/utils";

export default function HoverCard({ urlParams, title, preview = true }: { urlParams: string, title: string, preview?: boolean }) {
	const postsRes = useSWR(`${getBaseUrl()}/api/posts${urlParams}`, fetcher, { refreshInterval: 10000 });
	if (postsRes.isLoading) {
		return (
			<div className="card w-96 bg-neutral text-primary-content max-w-full overflow-hidden items-center justify-center">
				<span className="loading loading-ring loading-lg min-w-[50%]"></span>
			</div>
		);
	}
	if (postsRes.error) {
		return (
			<div className="card w-96 bg-neutral text-primary-content max-w-full overflow-hidden items-center justify-center"></div>
		);
	}
	const posts: Array<PostWithChapters> = postsRes.data;

	return (
		<div className="card w-96 bg-neutral text-primary-content max-w-full items-stretch overflow-hidden">
			{posts.map((post, i) => (
				<Link href={`${getBaseUrl()}/${post.postTypeId}/${post.path}`} key={i} className="card-body p-0 relative border-base-300 [&:not(:first-child)]:border-t [&:not(:last-child)]:border-b h-full group">
					<div className="h-full flex flex-col">
						<div className="card-body pb-5 transition duration-300 ease-in-out group-hover:opacity-0">
							<h2 className="card-title flex justify-center text-3xl">{post.title}</h2>
						</div>
						<div className="bg-cover bg-no-repeat bg-center h-full" style={preview && post.imageLink ? {backgroundImage: `url(${post.imageLink})`} : {}}></div>
					</div>
					<div className={`card px-10 py-5 absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-black bg-fixed opacity-0 transition duration-300 ease-in-out group-hover:opacity-[90%] rounded-b-none rounded-t-none`}>
						<h1 className="text-info text-xl pb-2 mb-5 border-default border-b-2">
							{fixDate(post.dateModified)}
						</h1>
						<div className="text-2xl">{post.chapters[0]?.title}</div>
						<div dangerouslySetInnerHTML={{__html: preview ? smartTrim(post.chapters[0].content) + "..." : ""}}>
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
