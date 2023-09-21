import moment from "moment";
import type { Post } from "../types/types";
import bcrypt from 'bcrypt';

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

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
	const chapters = url.searchParams.get("chapters");

	return { fields, filter, sort, chapters };
}

export function buildQuery(table: string, { fields, filter, sort }: {
	fields?: Array<string>,
	filter?: Array<string>,
	sort?: Array<string>
}) {
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
			values.push({
				[qArr[0]]: qArr[1]
			});
			return "?";
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

			values.push(sortQ);
			let qStr = `?? ${order}`;

			if (qArr[1]) {
				values.push(Number(qArr[1]));
				qStr += " LIMIT ?";
			}

			return qStr;
		}).join(", ");
	}

	return {
		queryStr,
		values
	}
}

export function buildURLParams({ fields, filter, sort, chapters }: {
	fields?: Array<string>,
	filter?: Array<{ filterField: string, filterValue: string }>,
	sort?: Array<{ sortField: string, desc?: boolean, limit?: number }>
	chapters?: boolean
}) {
	let urlParamsArr = [];

	if (fields?.length) {
		urlParamsArr.push(fields.map((field) => {
			return `fields[]=${field}`;
		}).join("&"));
	}

	if (filter?.length) {
		urlParamsArr.push(filter.map(({ filterField, filterValue }) => {
			return `filter[]=${filterField},${filterValue}`;
		}).join("&"));
	}

	if (sort?.length) {
		let sortParams = "sort=";
		sortParams += sort.map(({ sortField, desc, limit }) => {
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
		urlParamsArr.push(sortParams);
	}

	if (chapters) {
		urlParamsArr.push("chapters=true");
	}

	return "?" + urlParamsArr.join("&");
}