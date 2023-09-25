"use client"

import { getBaseUrl } from "@/lib/utils";
import Link from "next/link";

export default function ChapterDropdown({ className, path, chapterNum, postTypeId, chaptersLen }: {
	className?: string,
	path: string,
	chapterNum: number,
	postTypeId: string,
	chaptersLen: number
}) {
	function __unfocus() {
		const el = document.getElementById("skipNav");
		if (el) {
		  	el.focus();
			el.blur();
		}
	}

	function unfocus() {
		__unfocus();
	}

	return (
		<div className={`${className} dropdown border-r-2`}>
			<label tabIndex={0} className="btn px-4">Chapters ▼</label>
			<ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
				{/* @ts-ignore */}
				{Array(chaptersLen).map((_, i) => (
					<li onClick={unfocus} key={i}>
						<Link className={`${i+1 == chapterNum ? "btn-disabled btn-active" : ""}`} href={`${getBaseUrl()}/${postTypeId}/${path}/${i+1}`}>Chapter {i+1}</Link>
					</li>
				))}
			</ul>
		</div>
	);
}