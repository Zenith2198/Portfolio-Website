"use client"

import Link from "next/link";
import type { ChangeEvent } from "react";
import { useRouter } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();

	const handleOptionSelect = (event: ChangeEvent<HTMLInputElement>) => {
		router.push(`${process.env.NEXT_PUBLIC_URL}/admin/${event.target.value}`);
	};

    return (
        <div>
			<Link href={`${process.env.NEXT_PUBLIC_URL}/`}>Home</Link>
			<Link href={`${process.env.NEXT_PUBLIC_URL}/api/auth/signout?callbackUrl=/`}>Sign Out</Link>
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

export async function generateMetadata() {
	return {
		title: "Admin Page"
	};
}