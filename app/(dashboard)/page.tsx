import type { Metadata } from "next";
import Link from "next/link";
import { getPrimaryStory, getRecentsOfType } from "@/lib/posts";

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
			<div className="flex justify-evenly m-10">
				<div className="card w-96 bg-neutral text-primary-content">
					<Link href="/" className="card-body">
						<h2 className="card-title flex justify-center text-center">Primary Story</h2>
					</Link>
				</div>
				<div className="card w-96 bg-neutral text-primary-content">
					<Link href={`/short-stories/${recentShortStory.path}`}  className="card-body">
						<h2 className="card-title flex justify-center text-center">{recentShortStory.title}</h2>
					</Link>
				</div>
				<div className="card w-96 bg-neutral text-primary-content">
					{recentBlogs.map(({ title, path }, i) => (
						<Link href={`/blogs/${path}`} className={`card-body border-black border-t-${i === 0 ? 0 : 2}`}>
							<h2  className="card-title flex justify-center text-center">{title}</h2>
						</Link>
					))}
				</div>
			</div>
		</main>
	)
}
