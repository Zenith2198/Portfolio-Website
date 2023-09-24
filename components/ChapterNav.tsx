import { buildURLParams } from "@/lib/utils2";
import Link from "next/link";
import ChapterDropdown from "@/components/ChapterDropdown";

export default async function ChapterNav({ className, path, chapterNum }: { className?: string, path: string, chapterNum: string}) {
	const urlQuery = buildURLParams({ chapters: true  });
	const postDataRes = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/posts/${path}?${urlQuery}`);
	const postData = await postDataRes.json();

	const chaptersLen = postData.chapters.length;
	const currURL = `${process.env.NEXT_PUBLIC_URL}/${postData.postType}/${path}`;
	const currChapter = Number(chapterNum);

	let chapterOptions = [];
	if (chaptersLen < 5) {
		for (let i=1; i < chaptersLen+1; i++) {
			chapterOptions.push(i);
		}
	} else if (currChapter < 4) {
		chapterOptions = [1, 2, 3, 4, 5];
	} else if (currChapter > chaptersLen-3) {
		chapterOptions = [chaptersLen-4, chaptersLen-3, chaptersLen-2, chaptersLen-1, chaptersLen];
	} else {
		chapterOptions = [currChapter-2, currChapter-1, currChapter, currChapter+1, currChapter+2];
	}

	return (
		<div className="join">
			<ChapterDropdown className={`${className} join-item`} path={path} chapterNum={chapterNum} urlQuery={urlQuery}/>
			<Link href={`${currChapter-1 > 0 ? currURL+"/"+(currChapter-1) : ""}`} className="w-[40px]">
				<button className="join-item btn">«</button>
			</Link>
			{/* @ts-ignore */}
			{chapterOptions.map((i) => (
				<Link href={`${currURL}/${i}`} key={i}>
					<button className={`join-item btn w-[40px] ${i == chapterNum ? "btn-active" : ""}`}>{i}</button>
				</Link>
			))}
			<Link href={`${currChapter+1 < chaptersLen+1 ? currURL+"/"+(currChapter+1) : ""}`}>
				<button className="join-item btn w-[40px]">»</button>
			</Link>
		</div>
	);
}