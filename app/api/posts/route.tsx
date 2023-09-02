import { NextResponse } from 'next/server'
import { getSortedPostsNoChapters, setNewPost } from '@/app/api/lib/db';

export async function GET(request: Request) {
	return NextResponse.json({allPostsData: await getSortedPostsNoChapters()});
}

export async function POST(request: Request) {
	const formData = await request.formData();

	//@ts-ignore
	const chapters = JSON.parse(formData.get("chapters"));
	formData.delete("chapters");
	let post = {};
	//@ts-ignore
	for (const [ name, value ] of formData.entries()) {
		//@ts-ignore
		post[name] = value;
	}
	await setNewPost(post, chapters);
	return NextResponse.json({ result: "success" });
}