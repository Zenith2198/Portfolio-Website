import { redirect } from "next/navigation";
import { getBaseUrl, buildURLParams } from "@/lib/utils";

export const dynamicParams = false;

export default async function Post({ params }: { params: { postTypeId: string, path: string } }) {
	const urlQuery = buildURLParams({ chapters: true });
	const postDataRes = await fetch(`${getBaseUrl()}/api/posts/${params.path}?${urlQuery}`);
	if (!postDataRes.ok) return <div>Error</div>;
	const postData = await postDataRes.json();

	if (postData.chapters.length === 0) {
		return (
			<div className="card bg-base-100 shadow-xl text-9xl p-16 text-center">There is nothing here yet!</div>
		);
    } else if (postData.chapters.length > 1) {
        redirect(`${getBaseUrl()}/${params.postTypeId}/${params.path}/${postData.chapters[0].chapterNum}`);
    }

	return (
		<div>
			<div className="card bg-base-100 shadow-xl p-10">
				<h1 className="text-5xl pb-5">{postData.chapters[0].title}</h1>
				<div className="m-5" dangerouslySetInnerHTML={{ __html: postData.chapters[0].content }} />
			</div>
		</div>
	);
}