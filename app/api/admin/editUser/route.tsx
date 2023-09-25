import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPass } from "@/lib/crypto";

export async function POST(request: Request) {
	const formData = await request.formData();

	let data = {} as {name?: string, passwordHash?: string};
	const name = formData.get("name") as string;
	if (name) {
		data.name = name;
	}
	const password = formData.get("password") as string;
	if (password) {
		data.passwordHash = await hashPass(password);
	}

	await prisma.user.update({
		where: {
			userId: Number(formData.get("userId"))
		},
		data
	});

	return NextResponse.json({ response: "success" });
}