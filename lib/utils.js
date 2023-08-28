import moment from 'moment';

// TODO: convert to local time
export function fixDates(target) {
	target.forEach((item, index) => {
		item.date = moment(item.date).format('YYYY-MM-DD hh:mm:ss a');
	});
}