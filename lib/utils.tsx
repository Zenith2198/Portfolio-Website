import moment from "moment";
import { Post } from "../types/types";
import bcrypt from 'bcrypt';

export function fixDates(target: Array<Post>) {
	target.forEach((item) => {
		item.dateModified = moment(item.dateModified as number * 1000).format('YYYY-MM-DD hh:mm:ss a');
		item.datePosted = moment(item.datePosted as number * 1000).format('YYYY-MM-DD hh:mm:ss a');
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