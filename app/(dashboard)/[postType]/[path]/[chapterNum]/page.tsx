import ChapterNav from "@/components/ChapterNav";
import ChapterDisplay from "@/components/ChapterDisplay";

export const dynamicParams = false;

export default async function Chapter({ params }: { params: { path: string, chapterNum: string } }) {
	return (
		<div>
			<ChapterNav path={params.path} chapterNum={params.chapterNum}/>
			<ChapterDisplay path={params.path} chapterNum={params.chapterNum}/>
			<ChapterNav className="dropdown-top" path={params.path} chapterNum={params.chapterNum}/>
		</div>
	);
}