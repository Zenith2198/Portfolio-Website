import moment from "moment";
import type { Post } from "../types/types";
import bcrypt from 'bcrypt';

export function fixDates(target: Array<Post>) {
	target.forEach((item) => {
		item.dateModified = moment(item.dateModified as number * 1000).format("M.D.YYYY");
		item.datePosted = moment(item.datePosted as number * 1000).format("M.D.YYYY");
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

export function smartTrim(str: string, len: number) {
	let trimmedString = str.substring(0, len);
	trimmedString = trimmedString.substring(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")));
	return trimmedString;
}