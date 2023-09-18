import type { Chapter } from "@/types/types";
import { redirect } from "next/navigation";
import { buildURLParams } from "@/lib/utils";

export const dynamicParams = false;

export default async function Post({ params }: { params: { postType: string, path: string } }) {
	const urlQuery = buildURLParams({ chapters: true });
	const postDataRes = await fetch(`${process.env.PUBLIC_URL_DEV}/api/posts/${params.path}${urlQuery}`);
	const postData = await postDataRes.json();

	if (postData.chapters.length > 1) {
        redirect(`${process.env.PUBLIC_URL_DEV}/${params.postType}/${params.path}/${postData.chapters[0].chapterNum}`);
    }

	return (
		<div>
			<div className='m-20'>
				{postData.chapters.map((chapter: Chapter) => (
					<div key={chapter.chapterNum}>
						<h2 className='text-2xl'>{chapter.title}</h2>
						<div>{chapter.datePosted}</div>
						<div>Last modified: {chapter.dateModified}</div>
						<div className='m-20' dangerouslySetInnerHTML={{ __html: chapter.content }} />
					</div>
				))}
			</div>
		</div>
	);
}