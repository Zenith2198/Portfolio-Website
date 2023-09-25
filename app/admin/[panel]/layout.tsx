"use client"

import type { ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { getBaseUrl } from "@/lib/utils";

export default function PanelLayout({ children, params }: { children: React.ReactNode, params: { panel: string } }) {
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
			<div>
				{children}
			</div>
		</div>
	);
}

export async function generateStaticParams() {
	return [
		{ "panel": "newPost" },
		{ "panel": "editPost" }
	];
}

export async function generateMetadata({ params }: { params: { panel: string } }) {
	return {
		title: `Admin Page: ${params.panel}`
	};
}