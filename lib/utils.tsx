import moment from "moment";
import type { Post } from "../types/types";
import bcrypt from 'bcrypt';

export function fixDates(target: Array<Post>) {
	target.forEach((item) => {
		if (item.dateModified) {
			item.dateModified = moment(item.dateModified as number * 1000).format("M.D.YYYY");
		}
		if (item.datePosted) {
			item.datePosted = moment(item.datePosted as number * 1000).format("M.D.YYYY");
		}
	});
}

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

export function smartTrim(str: string, len: number) {
	if (!str) {
		return "";
	}
	let trimmedString = str.substring(0, len);
	trimmedString = trimmedString.substring(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")));
	return trimmedString;
}

export function processURL(url: URL) {
	const fields = url.searchParams.getAll("fields[]");
	const filter = url.searchParams.getAll("filter[]");
	const sort = url.searchParams.get("sort")?.split(",");

	return { fields, filter, sort };
}

export function assembleQuery(table: string, { fields, filter, sort }: { fields?: Array<string>, filter?: Array<string>, sort?: Array<string> }) {
	let queryStr = "SELECT ";
	let values = [];

	if (fields?.length) {
		queryStr += "??";
		values.push(fields);
	} else {
		queryStr += "*";
	}

	queryStr += " FROM " + table;

	if (filter?.length) {
		queryStr += " WHERE ";
		queryStr += filter.map((q) => {
			const qArr = q.split(",");
			values.push(qArr[1]);
			return `${qArr[0]}=?`; //POTENTIAL SQL INJECTION POINT, CAN'T REMOVE QUOTES
		}).join(" AND ");
	}

	if (sort?.length) {
		queryStr += " ORDER BY ";
		queryStr += sort.map((q) => {
			const qArr = q.split(":");

			let order = "ASC";
			let sortQ = qArr[0];
			if (sortQ.charAt(0) === "-") {
				order = "DESC";
				sortQ = qArr[0].substring(1);
			}

			let qStr = `${sortQ} ${order}`; //POTENTIAL SQL INJECTION POINT, CAN'T REMOVE QUOTES

			if (qArr[1]) {
				qStr += ` LIMIT ${qArr[1]}`; //POTENTIAL SQL INJECTION POINT, CAN'T REMOVE QUOTES
			}

			return qStr;
		}).join(", ");
	}

	return {
		queryStr,
		values
	}
}

export function buildURLQuery({ fields, filter, sort }: {
	fields?: Array<string>,
	filter?: Array<{ filterField: string, filterValue: string }>,
	sort?: Array<{ sortField: string, desc?: boolean, limit?: number }>
}) {
	let urlQueryArr = [];

	if (fields?.length) {
		urlQueryArr.push(fields.map((field) => {
			return `fields[]=${field}`;
		}).join("&"));
	}

	if (filter?.length) {
		urlQueryArr.push(filter.map(({ filterField, filterValue }) => {
			return `filter[]=${filterField},${filterValue}`;
		}).join("&"));
	}

	if (sort?.length) {
		let sortQuerry = "sort=";
		sortQuerry += sort.map(({ sortField, desc, limit }) => {
			let temp = "";
			if (desc) {
				temp += "-";
			}
			temp += sortField;
			if (limit) {
				temp += `:${limit}`;
			}
			return temp;
		}).join(",");
		urlQueryArr.push(sortQuerry);
	}

	return "?" + urlQueryArr.join("&");
}