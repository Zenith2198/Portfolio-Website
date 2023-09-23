"use client"

import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import Link from "next/link";

export default function ChapterDropdown({ className, path, chapterNum, urlQuery }: { className?: string, path: string, chapterNum: string, urlQuery: string}) {
	const { data, isLoading, error } = useSWR(`/api/posts/${path}?${urlQuery}`, fetcher);
	if (isLoading) return <div>Loading...</div>;
  	if (error) return <div>Error</div>;

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
				{data.chapters.map((chapter, i) => (
					<li onClick={unfocus} key={i}>
						<Link className={`${i+1 == chapterNum ? "btn-disabled btn-active" : ""}`} href={`${process.env.PUBLIC_URL_DEV}/${data.postTypeId}/${path}/${i+1}`}>Chapter {i+1}</Link>
					</li>
				))}
			</ul>
		</div>
	);
}