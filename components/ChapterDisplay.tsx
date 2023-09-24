import { getBaseUrl, buildURLParams } from "@/lib/utils";

export default async function ChapterDisplay({ path, chapterNum }: { path: string, chapterNum: string }) {
	// const urlQuery = buildURLParams({ chapters: true  });
	// const postDataRes = await fetch(`${getBaseUrl()}/api/posts/${path}?${urlQuery}`);
	// if (!postDataRes.ok) return <div>Error</div>;
	// const postData = await postDataRes.json();

	return (
		<div className="card bg-base-100 shadow-xl p-10 my-3">
			{/* <h1 className="text-5xl pb-5">{postData.chapters[Number(chapterNum) - 1].title}</h1>
			<div className="m-5" dangerouslySetInnerHTML={{ __html: postData.chapters[Number(chapterNum) - 1].content }} /> */}
		</div>
	);
}