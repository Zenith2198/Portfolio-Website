import moment from "moment";
import { Post } from "../types/types";
import bcrypt from 'bcrypt';

// TODO: convert to local time
export function fixDates(target: Array<Post>) {
	target.forEach((item) => {
		item.date = moment(item.date).format('YYYY-MM-DD hh:mm:ss a');
	});
}

export async function hashPass(unHashPass: string) {
	return bcrypt.hash(unHashPass, 10).then(function(hash: string) {
		return hash;
	});
}

export async function checkPass(unHashPass: string, hashPass: string) {
	return bcrypt.compare(unHashPass, hashPass).then((result: boolean) => {
		return result;
	});
}