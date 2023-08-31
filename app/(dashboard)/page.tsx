//@ts-nocheck

import type { Metadata } from "next";
import Link from "next/link";
import { getPrimaryStory, getRecentsOfType } from "@/lib/db";
import { smartTrim } from "@/lib/utils";

export let metadata: Metadata = {
	title: "Paig's Bog",
	description: "",
}

export default async function Home() {
	let primaryStory = await getPrimaryStory();
	let recentShortStoryArr = await getRecentsOfType("short-stories");
	let recentShortStory = recentShortStoryArr[0];
	let recentBlogs = await getRecentsOfType("blogs", 2);

	return (
		<main className="min-w-full">
			<div className="flex flex-col lg:flex-row justify-evenly p-10 min-h-full max-w-full">
			<div className="card w-96 bg-neutral text-primary-content max-w-full overflow-hidden">
					<Link href={`/long-stories/${primaryStory.path}`} className="card-body p-0 relative group">
						<div className="h-full flex flex-col">
							<div className="card-body pb-5 transition duration-300 ease-in-out group-hover:opacity-0">
								<h2 className="card-title flex justify-center">{primaryStory.title}</h2>
							</div>
							<div className="bg-cover bg-no-repeat bg-center h-full" style={{backgroundImage: `url(${primaryStory?.image || ""})`}}></div>
						</div>
						<div className="card px-10 py-5 absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-black bg-fixed opacity-0 transition duration-300 ease-in-out group-hover:opacity-[90%]">
							<h1 className="text-info text-xl pb-2 mb-5 border-default border-b-2">
								{primaryStory.dateModified}
							</h1>
							<div className="text-2xl">{primaryStory.chapters[0].title}</div>
							<div>
								{`${smartTrim(primaryStory.chapters[0].content, 500)}...`}
							</div>
							<h1 className="text-info text-3xl text-center pt-10">
								Read More
							</h1>
						</div>
					</Link>
				</div>
				<div className="card w-96 bg-neutral text-primary-content max-w-full overflow-hidden">
					<Link href={`/short-stories/${recentShortStory.path}`} className="card-body p-0 relative group">
						<div className="h-full flex flex-col">
							<div className="card-body pb-5 transition duration-300 ease-in-out group-hover:opacity-0">
								<h2 className="card-title flex justify-center">{recentShortStory.title}</h2>
							</div>
							<div className="bg-cover bg-no-repeat bg-center h-full" style={{backgroundImage: `url(${recentShortStory?.image || ""})`}}></div>
						</div>
						<div className="card px-10 py-5 absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-black bg-fixed opacity-0 transition duration-300 ease-in-out group-hover:opacity-[90%]">
							<h1 className="text-info text-xl pb-2 mb-5 border-default border-b-2">
								{recentShortStory.dateModified}
							</h1>
							<div className="text-2xl">{recentShortStory.chapters[0].title}</div>
							<div>
								{`${smartTrim(recentShortStory.chapters[0].content, 500)}...`}
							</div>
							<h1 className="text-info text-3xl text-center pt-10">
								Read More
							</h1>
						</div>
					</Link>
				</div>
				<div className="card w-96 bg-neutral text-primary-content max-w-full items-stretch overflow-hidden">
					{recentBlogs.map((blog, i) => (
						<Link href={`/blogs/${blog.path}`} className="card-body p-0 relative border-base-300 [&:not(:first-child)]:border-t [&:not(:last-child)]:border-b h-full group">
							<div className="h-full flex flex-col">
								<div className="card-body pb-5 transition duration-300 ease-in-out group-hover:opacity-0">
									<h2 className="card-title flex justify-center">{blog.title}</h2>
								</div>
								<div className="bg-cover bg-no-repeat bg-center h-full" style={{backgroundImage: `url(${blog?.image || ""})`}}></div>
							</div>
							<div className={`card px-10 py-5 absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-black bg-fixed opacity-0 transition duration-300 ease-in-out group-hover:opacity-[90%] ${i===0?"rounded-b-none":""} ${i===recentBlogs.length-1?"rounded-t-none":""}`}>
								<h1 className="text-info text-xl pb-2 mb-5 border-default border-b-2">
									{blog.dateModified}
								</h1>
								<div className="text-2xl">{blog.chapters[0].title}</div>
								<div>
									{`${smartTrim(blog.chapters[0].content, 100)}...`}
								</div>
							<h1 className="text-info text-3xl text-center pt-10">
								Read More
							</h1>
						</div>
						</Link>
					))}
				</div>
			</div>
		</main>
	)
}
