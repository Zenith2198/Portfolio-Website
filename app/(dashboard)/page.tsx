import type { Metadata } from "next";
import Link from "next/link";
import { getPrimaryStory, getRecentsOfType } from "@/lib/db";
import { smartTrim } from "@/lib/utils";

export const metadata: Metadata = {
	title: "Paig's Bog",
	description: "",
}

export default async function Home() {
	let primaryStory = await getPrimaryStory();
	let recentShortStoryArr = await getRecentsOfType("shortStories");
	let recentShortStory = recentShortStoryArr[0];
	let recentBlogs = await getRecentsOfType("blogs", 4);

	return (
		<main className="min-w-full">
			<div className="flex flex-col lg:flex-row justify-evenly p-10 min-h-full max-w-full">
				<div className="card w-96 bg-neutral text-primary-content max-w-full">
					<Link href="/" className="card-body"> {/* p-0 */}
						{/* <Tooltip id="primaryStory" className="card-body" post={{ postType: "longStory" }}> */}
							<h2 className="card-title flex justify-center text-center">Primary Story</h2>
						{/* </Tooltip> */}
					</Link>
				</div>
				<div className="card w-96 bg-neutral text-primary-content max-w-full group">
					<Link href={`/short-stories/${recentShortStory.path}`} className="card-body relative">
						<div className="card-title flex justify-center text-center transition duration-300 ease-in-out group-hover:opacity-0">
							<h2>{recentShortStory.title}</h2>
						</div>
						<div className="card px-10 py-5 absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-black bg-fixed opacity-0 transition duration-300 ease-in-out group-hover:opacity-50">
							<h1 className="text-info text-xl pb-2 mb-5 border-default border-b-2">
								{recentShortStory.dateModified}
							</h1>
							<div>
								{`${smartTrim(recentShortStory.content, 500)}...`}
							</div>
							<h1 className="text-info text-3xl text-center pt-10">
								Read More
							</h1>
						</div>
					</Link>
				</div>
				<div className="card w-96 bg-neutral text-primary-content max-w-full items-stretch">
					{recentBlogs.map((blog) => (
						<Link href={`/blogs/${blog.path}`} className="card-body border-base-300 border-b border-t first:border-t-0 last:border-b-0 h-full">
							<h2  className="card-title flex justify-center text-center">{blog.title}</h2>
						</Link>
					))}
				</div>
			</div>
		</main>
	)
}
