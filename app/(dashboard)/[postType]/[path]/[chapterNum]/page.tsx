import { buildURLParams } from "@/lib/utils";
import ChapterNav from "@/components/ChapterNav";

export const dynamicParams = false;

export default async function Chapter({ params }: { params: { path: string, chapterNum: string } }) {
	const urlQuery = buildURLParams({ chapters: true  });
	const postDataRes = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/posts/${params.path}?${urlQuery}`);
	const postData = await postDataRes.json();

	return (
		<div>
			<ChapterNav path={params.path} chapterNum={params.chapterNum}/>
			<div className="card bg-base-100 shadow-xl p-10 my-3">
				<h1 className="text-5xl pb-5">{postData.chapters[Number(params.chapterNum) - 1].title}</h1>
				<div className="m-5" />
			</div>
			<ChapterNav className="dropdown-top" path={params.path} chapterNum={params.chapterNum}/>
		</div>
	);
}