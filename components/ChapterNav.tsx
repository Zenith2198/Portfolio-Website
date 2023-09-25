import { prisma } from "@/lib/db";
import { getBaseUrl, buildURLParams } from "@/lib/utils";
import Link from "next/link";
import ChapterDropdown from "@/components/ChapterDropdown";

export default async function ChapterNav({ className, path, chapterNum }: { className?: string, path: string, chapterNum: string}) {
	const post = await prisma.post.findUnique({
		where: {
			path
		},
		select: {
			postTypeId: true,
			_count: {
				select: {
					chapters: true
				}
			}
		}
	});
	if (!post) return <div>Error</div>;

	const chaptersLen = post._count.chapters;
	const currURL = `${getBaseUrl()}/${post.postTypeId}/${path}`;
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
			<ChapterDropdown className={`${className} join-item`} path={path} chapterNum={Number(chapterNum)} postTypeId={post.postTypeId} chaptersLen={chaptersLen}/>
			<Link href={`${currChapter-1 > 0 ? currURL+"/"+(currChapter-1) : ""}`} className="w-[40px]">
				<button className="join-item btn">«</button>
			</Link>
			{/* @ts-ignore */}
			{chapterOptions.map((i) => (
				<Link href={`${currURL}/${i}`} key={i}>
					<button className={`join-item btn w-[40px] ${i == currChapter ? "btn-active" : ""}`}>{i}</button>
				</Link>
			))}
			<Link href={`${currChapter+1 < chaptersLen+1 ? currURL+"/"+(currChapter+1) : ""}`}>
				<button className="join-item btn w-[40px]">»</button>
			</Link>
		</div>
	);
}