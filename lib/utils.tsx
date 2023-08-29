import moment from "moment";
import { Post } from "../types/types";

// TODO: convert to local time
export function fixDates(target: Array<Post>) {
	target.forEach((item) => {
		item.date = moment(item.date).format('YYYY-MM-DD hh:mm:ss a');
	});
}