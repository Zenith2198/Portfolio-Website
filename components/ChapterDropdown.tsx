"use client"

import useSWR from "swr";
import { fetcher, getBaseUrl } from "@/lib/utils";
import Link from "next/link";

export default function ChapterDropdown({ className, path, chapterNum, urlQuery }: { className?: string, path: string, chapterNum: string, urlQuery: string}) {
	// const { data, isLoading, error } = useSWR(`${getBaseUrl()}/api/posts/${path}?${urlQuery}`, fetcher);
	// if (isLoading) return <div>Loading...</div>;
  	// if (error) return <div>Error</div>;

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
			
		</div>
	);
}