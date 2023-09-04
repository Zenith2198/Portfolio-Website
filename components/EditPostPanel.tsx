import type { FormEvent } from "react";

export default function AdminPanel({ className="" }: { className?: string }) {
	const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
	}
	return (
		<form onSubmit={onSubmit} autoComplete="off" className={`${className}`}>
			EDIT
		</form>
	);
}