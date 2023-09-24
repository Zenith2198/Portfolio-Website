import moment from "moment";
import type { Post } from "@prisma/client";

export async function fetcher(url: string) {
	const res = await fetch(url);
	if (!res.ok) return { response: "error" };
	return await res.json();
}

export function getBaseUrl() {
	if (process.env.NODE_ENV === "development") {
		return "http://localhost:3000";
	}
	return `https://${process.env.VERCEL_URL}`;
}

export function fixDate(unixTimestamp: number) {
	return moment(unixTimestamp * 1000).format("M.D.YYYY");
}

export function smartTrim(str: string, len: number) {
	return str;
	//TODO: make it trim HTML neatly
	if (!str) {
		return "";
	}
	let trimmedString = str.substring(0, len);
	trimmedString = trimmedString.substring(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")));
	return trimmedString;
}

export function isEmpty(obj: Object) {
	for (const x in obj) { if (obj.hasOwnProperty(x))  return false; }
   return true;
}

export function buildURLParams({ fields, filter, sort, take, chapters }: {
	fields?: Array<string>,
	filter?: Array<{ filterField: string, filterValue: string }>,
	sort?: Array<{ sortField: string, desc?: boolean }>
	take?: Number,
	chapters?: boolean
}) {
	let urlParamsArr = [];

	if (fields?.length) {
		urlParamsArr.push(fields.map((field) => {
			return `field[]=${field}`;
		}).join("&"));
	}

	if (filter?.length) {
		urlParamsArr.push(filter.map(({ filterField, filterValue }) => {
			return `filter[]=${filterField},${filterValue}`;
		}).join("&"));
	}

	if (sort?.length) {
		urlParamsArr.push(sort.map(({ sortField, desc }) => {
			return `sort[]=${desc ? "-" : ""}${sortField}`;
		}).join("&"));
	}

	if (take) {
		urlParamsArr.push(`take=${take}`);
	}

	if (chapters) {
		urlParamsArr.push("chapters=true");
	}

	return urlParamsArr.join("&");
}

export function processGETUrl(url: URL) {
	let select = url.searchParams.getAll("field[]")
		.reduce(
			(obj, f) => Object.assign(obj, { [f]: true }), {}
		);

	const where = url.searchParams.getAll("filter[]")
		.reduce(
			(obj, f) => {
				const fArr = f.split(",");

				let boolVal = null;
				if (fArr[1] === "true") {
					boolVal = true;
				} else if (fArr[1] === "false") {
					boolVal = false;
				}

				return Object.assign(obj, { [fArr[0]]: boolVal === null ? fArr[1] : boolVal });
			}, {}
		);

	const orderBy = url.searchParams.getAll("sort[]")
		.reduce(
			(obj, s) => {
				let sTemp = s;
				let order = "asc";
				if (s.charAt(0) === "-") {
					order = "desc";
					sTemp = s.slice(1);
				}
				return Object.assign(obj, { [sTemp]: order });
			}, {}
		);

	const urlChapters = url.searchParams.get("chapters");
	let include = {}
	if (urlChapters && urlChapters === "true") {
		if (isEmpty(select)) {
			include = {
				chapters: {
					orderBy: {
						chapterNum: "asc"
					}
				}
			}
		} else {
			select = {
				...select,
				chapters: {
					orderBy: {
						chapterNum: "asc"
					}
				}
			}
		}
	}

	const take = Number(url.searchParams.get("take"));

	let queryObj = {} as {select?: Object, where?: Object, orderBy?: Object, take?: number, include?: Object};
	if (!isEmpty(select)) {
		queryObj.select = select;
	}
	if (!isEmpty(where)) {
		queryObj.where = where;
	}
	if (!isEmpty(orderBy)) {
		queryObj.orderBy = orderBy;
	}
	if (take) {
		queryObj.take = take;
	}
	if (!isEmpty(include)) {
		queryObj.include = include;
	}

	return queryObj;
}
