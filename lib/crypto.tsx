import { hash, compare } from "bcrypt";

export async function hashPass(unHashPass: string) {
	return hash(unHashPass, 10).then(function (hash: string) {
		return hash;
	});
}

export async function checkPass(unHashPass: string, hashPass: string) {
	return compare(unHashPass, hashPass).then((result: boolean) => {
		return result;
	});
}