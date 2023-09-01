import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function fetchURL(url: string) {
	const { data } = useSWR(url, fetcher);
	return data;
}