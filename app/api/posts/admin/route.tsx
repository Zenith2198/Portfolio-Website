import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	const formData = await request.formData();

	//@ts-ignore
	const chapters = JSON.parse(formData.get("chapters"));
	formData.delete("chapters");
	let post = {};
	//@ts-ignore
	for (const [name, value] of formData.entries()) {
		//@ts-ignore
		post[name] = value;
	}
	console.log(post)
	console.log(1)
	console.log(chapters)

	return NextResponse.json({ result: "success" });
}