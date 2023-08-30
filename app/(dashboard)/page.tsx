import type { Metadata } from "next";
import Link from "next/link";
import { getPrimaryStory, getRecentsOfType } from "@/lib/db";

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
				<div className="card w-96 bg-neutral text-primary-content max-w-full" data-tip="hello">
					<Link href="/" className="card-body tooltip lg:tooltip-right" data-tip="hello">
						<h2 className="card-title flex justify-center text-center">Primary Story</h2>
					</Link>
				</div>
				<div className="card w-96 bg-neutral text-primary-content max-w-full">
					<Link href={`/short-stories/${recentShortStory.path}`}  className="card-body">
						<h2 className="card-title flex justify-center text-center">{recentShortStory.title}</h2>
						{/* <p>{recentShortStory.content}</p> */}
					</Link>
				</div>
				<div className="card w-96 bg-neutral text-primary-content max-w-full">
					{recentBlogs.map(({ title, path }, i) => (
						<Link href={`/blogs/${path}`} className="card-body tooltip lg:tooltip-left" data-tip="hello">
							<h2  className="card-title flex justify-center text-center">{title}</h2>
						</Link>
					))}
				</div>
			</div>
		</main>
	)
}
