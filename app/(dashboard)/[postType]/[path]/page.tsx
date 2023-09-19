import { redirect } from "next/navigation";
import { buildURLParams } from "@/lib/utils";

export const dynamicParams = false;

export default async function Post({ params }: { params: { postType: string, path: string } }) {
	const urlQuery = buildURLParams({ chapters: true });
	const postDataRes = await fetch(`${process.env.PUBLIC_URL_DEV}/api/posts/${params.path}${urlQuery}`);
	const postData = await postDataRes.json();

	if (postData.chapters.length === 0) {
		return (
			<div className="card bg-base-100 shadow-xl text-9xl p-16 text-center">There's nothing here yet!</div>
		);
    } else if (postData.chapters.length > 1) {
        redirect(`${process.env.PUBLIC_URL_DEV}/${params.postType}/${params.path}/${postData.chapters[0].chapterNum}`);
    }

	return (
		<div>
			<div className='m-10' dangerouslySetInnerHTML={{ __html: postData.chapters[0].content }} />
		</div>
	);
}