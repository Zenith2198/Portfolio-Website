import moment from "moment";
import type { PostWithChapters } from "@/types/types.d";

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
	fields?: Array<{ key: string, value?: Array<{ whereKey: string, whereValue: string | number }> }>,
	filter?: Array<{ key: string, value: string }>,
	sort?: Array<{ key: string, desc?: boolean }>
	take?: Number,
	chapters?: boolean | Array<{ whereKey: string, whereValue: string | number }>
}) {
	let urlParamsArr = [];

	if (fields?.length) {
		urlParamsArr.push(fields.map((field) => {
			let fieldsStr = `field[]=${field.key}`;
			if (field.value) {
				fieldsStr += ":" + field.value.map(({ whereKey, whereValue }) => {
					let temp = `${whereKey}=${whereValue}`;
					if (typeof whereValue === "number") {
						temp += "|n";
					}
					return temp;
				}).join(",");
			}
			return fieldsStr;
		}).join("&"));
	}

	if (filter?.length) {
		urlParamsArr.push(filter.map(({ key, value }) => {
			return `filter[]=${key},${value}`;
		}).join("&"));
	}

	if (sort?.length) {
		urlParamsArr.push(sort.map(({ key, desc }) => {
			return `sort[]=${desc ? "-" : ""}${key}`;
		}).join("&"));
	}

	if (take) {
		urlParamsArr.push(`take=${take}`);
	}

	if (chapters) {
		if (chapters === true) {
			urlParamsArr.push("chapters=true");
		} else {
			urlParamsArr.push("chapters=" + chapters.map(({ whereKey, whereValue }) => {
				let temp = `${whereKey}=${whereValue}`;
					if (typeof whereValue === "number") {
						temp += "|n";
					}
				return temp;
			}).join(","));
		}
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
									let isNum = wArr[1].split("|");
									let temp;
									if (isNum[1] === "n") {
										temp = Number(isNum[0])
									} else {
										temp = String(isNum[0])
									}
									return Object.assign(obj, { [String(wArr[0])]: temp })
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
							...urlChapters.split(",")
								.reduce((obj, w) => {
									const wArr = w.split("=");
									let isNum = wArr[1].split("|");
									let temp;
									if (isNum[1] === "n") {
										temp = Number(isNum[0])
									} else {
										temp = String(isNum[0])
									}
									return Object.assign(obj, { [String(wArr[0])]: temp })
								}, {})
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
