import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function getURL(url: string) {
	const { data, error, isLoading } = useSWR(url, fetcher);
	return { data, error, isLoading };
}

// export function postURL(url: string, body: any) {
// 	const fetcher = ({ url, body }: { url: string, body: any }) => {
// 		return fetch(url, { method: "POST", body: JSON.stringify(body) }).then((res) => res.json());
// 	}
// 	const { data, error, isLoading } = useSWR({ url, body }, fetcher);
// 	return { data, error, isLoading };
// }