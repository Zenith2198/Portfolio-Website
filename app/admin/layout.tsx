"use client"

import Link from "next/link";
import type { ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { getBaseUrl } from "@/lib/utils";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();

	const handleOptionSelect = (event: ChangeEvent<HTMLInputElement>) => {
		router.push(`${getBaseUrl()}/admin/${event.target.value}`);
	};

    return (
        <div>
			<Link href={`${getBaseUrl()}/`}>Home</Link>
			<Link href={`${getBaseUrl()}/api/auth/signout?callbackUrl=/`}>Sign Out</Link>
			<div className="join" onChange={handleOptionSelect}>
				<input value="newPost" defaultChecked className="join-item btn" type="radio" name="options" aria-label="New Post"/>
				<input value="editPost" className="join-item btn" type="radio" name="options" aria-label="Edit Post"/>
			</div>
			<div>
				{children}
			</div>
        </div>
    );
}