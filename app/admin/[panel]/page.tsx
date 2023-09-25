"use client"

import NewPostPanel from "@/components/NewPostPanel";
import EditPostPanel from "@/components/EditPostPanel";
import type { ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { getBaseUrl } from "@/lib/utils";

export const dynamicParams = false;

export default function Panel({ params }: { params: { panel: string } }) {
	const router = useRouter();

	const handleOptionSelect = (event: ChangeEvent<HTMLInputElement>) => {
		router.push(`${getBaseUrl()}/admin/${event.target.value}`);
	};

	return (
		<div>
			<div className="join" onChange={handleOptionSelect}>
				<input value="newPost" checked={params.panel === "newPost"} readOnly className="join-item btn" type="radio" name="options" aria-label="New Post"/>
				<input value="editPost" checked={params.panel === "editPost"} readOnly className="join-item btn" type="radio" name="options" aria-label="Edit Post"/>
			</div>
			<NewPostPanel className={`${params.panel==="newPost"?"block":"hidden"}`}/>
			<EditPostPanel className={`${params.panel==="editPost"?"block":"hidden"}`}/>
		</div>
	);
}