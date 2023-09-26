import moment from "moment";
import type { PostWithChapters } from "@/types/types.d";
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
	return `https://www.paradoxacrania.com/`;
}

export function fixDate(unixTimestamp: number) {
	return moment(unixTimestamp * 1000).format("M.D.YYYY");
}

export function smartTrim(str: string, len: number) {
	return str;
	//TODO: make it trim HTML neatly
	//keep track of all unclosed HTML tags, and close them
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

export function fixChapters(post: PostWithChapters) {
	post.chapters.forEach((chapter) => {
		if (chapter.content) {
			//@ts-ignore
			chapter.content = chapter.content.toString("utf8");
		}
	});
}

export function fixChaptersArr(posts: PostWithChapters[]) {
	posts.forEach((post) => {
		post.chapters.forEach((chapter) => {
			if (chapter.content) {
				//@ts-ignore
				chapter.content = chapter.content.toString("utf8");
			}
		});
	});
}

export function buildURLParams({ fields, filter, sort, take, chapters }: {
	fields?: Array<{ fieldKey: string, fieldValue?: Array<{ whereKey: string, whereValue: string }> }>,
	filter?: Array<{ filterKey: string, filterValue: string }>,
	sort?: Array<{ sortKey: string, desc?: boolean }>
	take?: Number,
	chapters?: boolean
}) {
	let urlParamsArr = [];

	if (fields?.length) {
		urlParamsArr.push(fields.map((field) => {
			let fieldsStr = `field[]=${field.fieldKey}`;
			if (field.fieldValue) {
				fieldsStr += ":" + field.fieldValue.map(({ whereKey, whereValue }) => {
					return `${whereKey}=${whereValue}`;
				}).join(",");
			}
			return fieldsStr;
		}).join("&"));
	}

	if (filter?.length) {
		urlParamsArr.push(filter.map(({ filterKey, filterValue }) => {
			return `filter[]=${filterKey},${filterValue}`;
		}).join("&"));
	}

	if (sort?.length) {
		urlParamsArr.push(sort.map(({ sortKey, desc }) => {
			return `sort[]=${desc ? "-" : ""}${sortKey}`;
		}).join("&"));
	}

	if (take) {
		urlParamsArr.push(`take=${take}`);
	}

	if (chapters) {
		urlParamsArr.push("chapters=true");
	}

	return "?" + urlParamsArr.join("&");
}

export function processSearchParams(searchParams: URLSearchParams) {
	let select = searchParams.getAll("field[]")
		.reduce((obj, f) => {
			const fArr = f.split(":");

			if (fArr[1]) {
				return {
					[String(fArr[0])]: {
						where: {
							...fArr[1].split(",")
								.reduce((obj, w) => {
									const wArr = w.split("=");
									return Object.assign(obj, { [String(wArr[0])]: String(wArr[1]) })
								}, {})
							}
						}
					}
			} else {
				return Object.assign(obj, { [String(f)]: true });
			}
		}, {});

	const where = searchParams.getAll("filter[]")
		.reduce((obj, f) => {
			const fArr = f.split(",");

			let boolVal = null;
			if (fArr[1] === "true") {
				boolVal = true;
			} else if (fArr[1] === "false") {
				boolVal = false;
			}

			return Object.assign(obj, { [String(fArr[0])]: boolVal === null ? String(fArr[1]) : boolVal });
		}, {});

	const orderBy = searchParams.getAll("sort[]")
		.reduce((obj, s) => {
			let sTemp = s;
			let order = "asc";
			if (s.charAt(0) === "-") {
				order = "desc";
				sTemp = s.slice(1);
			}
			return Object.assign(obj, { [String(sTemp)]: order });
		}, {});

	const urlChapters = searchParams.get("chapters");
	let include = {}
	if (urlChapters) {
		if (urlChapters === "true") {
			if (isEmpty(select)) {
				include = {
					chapters: {
						orderBy: {
							chapterNum: "asc"
						}
					}
				};
			} else {
				select = {
					...select,
					chapters: {
						orderBy: {
							chapterNum: "asc"
						}
					}
				};
			}
		} else {
			if (isEmpty(select)) {
				include = {
					chapters: {
						where: {
							chapterNum: String(urlChapters)
						}
					}
				};
			}
		}
	}

	const take = Number(searchParams.get("take"));

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
