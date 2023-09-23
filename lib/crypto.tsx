import bcrypt from 'bcrypt';

export async function hashPass(unHashPass: string) {
	return bcrypt.hash(unHashPass, 10).then(function (hash: string) {
		return hash;
	});
}

export async function checkPass(unHashPass: string, hashPass: string) {
	return bcrypt.compare(unHashPass, hashPass).then((result: boolean) => {
		return result;
	});
}