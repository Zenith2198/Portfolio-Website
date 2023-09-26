"use client"

import { useState } from 'react';
import type { ChangeEvent, FormEvent } from "react";
import type { User } from "@prisma/client";
import useSWR from "swr";
import { fetcher, getBaseUrl } from "@/lib/utils";

export default function AdminPanel({ className="" }: { className?: string }) {
	const [postResponse, setPostResponse] = useState("");
	const [userId, setUserId] = useState("");
	
	const usersResponse = useSWR(`${getBaseUrl()}/api/admin/users`, fetcher);
	if (usersResponse.isLoading) return <div>Loading...</div>;
  	if (usersResponse.error) return <div>Error</div>;
	const allUsers: Array<User> = usersResponse.data;

	function handleTitle(event: ChangeEvent<HTMLInputElement>) {
		const nameMatchErr = allUsers.filter((str) => event.target.value?.toLowerCase() === str.name.toLowerCase());
		const nameError = document.getElementById("editUserNameError");
		if (nameError) {
			if (event.target.value === allUsers.find((user) => user.userId === Number(userId))?.name) {
				nameError.innerHTML = "Name is the same as previous";
			} else {
				nameError.innerHTML = "Name already exists";
			}
			if (nameMatchErr.length !== 0) {
				if (!event.target.className.includes(" input-error")) {
					nameError.className = nameError.className.replace(" hidden", "");
					event.target.className += " input-error";
				}
			} else {
				if (!nameError.className.includes(" hidden")) {
					nameError.className += " hidden";
				}
				event.target.className = event.target.className.replace(" input-error", "");
			}
		}
	}

	function handlePassword() {
		const password = document.getElementById("editUserPassword") as HTMLInputElement;
		const retypePassword = document.getElementById("editUserRetypePassword") as HTMLInputElement;
		const passwordError = document.getElementById("editUserPasswordError");
		if (password && retypePassword && passwordError) {
			if (retypePassword.value && password.value !== retypePassword.value) {
				if (!retypePassword.className.includes(" input-error")) {
					passwordError.className = passwordError.className.replace(" hidden", "");
					retypePassword.className += " input-error";
				}
			} else {
				if (!passwordError.className.includes(" hidden")) {
					passwordError.className += " hidden";
				}
				retypePassword.className = retypePassword.className.replace(" input-error", "");
			}
		}
	}

	async function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const nameError = document.getElementById("editUserNameError");
		if (nameError && !nameError.className.includes(" hidden")) {
			nameError.scrollIntoView({ behavior: "smooth" });
			return false;
		}

		const passwordError = document.getElementById("editUserPasswordError");
		if (passwordError && !passwordError.className.includes(" hidden")) {
			passwordError.scrollIntoView({ behavior: "smooth" });
			return false;
		}

		let formData = new FormData(event.currentTarget);

		if (!formData.get("name") && !formData.get("password")) {
			window.scrollTo({ top: 0, behavior: 'smooth' });
			return false;
		}

		const editUserLoadingModal = document.getElementById("editUserLoadingModal") as HTMLInputElement;
		if (editUserLoadingModal) {
			editUserLoadingModal.checked = true;
		}
		const submitRes = await fetch(`${getBaseUrl()}/api/admin/editUser`, {
			method: "POST",
			body: formData
		});
		if (!submitRes.ok) return false;
		const res = await submitRes.json();
		setPostResponse(res.response);
	};

	return (
		<div>
			<form onSubmit={onSubmit} autoComplete="off" className={`${className}`}>
				<div className="form-control w-full max-w-xs">
					<label className="label">
						<span className="label-text">User</span>
					</label>
					<select name="userId" required value={userId} onChange={(e) => setUserId(e.target.value)} className="select select-bordered w-full max-w-xs">
						<option value="" disabled>Select user</option>
						{allUsers.map(({ userId, name }) => (
							<option value={userId} key={userId}>{name}</option>
						))}
					</select>
					<label className="label">
						<span></span>
						<span className="label-text-alt">Required</span>
					</label>
				</div>
				{userId ?
					<div>
						<div className="form-control w-full max-w-xs">
							<label className="label">
								<span className="label-text">User name</span>
								<span id="editUserNameError" className="label-text-alt hidden"></span>
							</label>
							<input name="name" onChange={handleTitle} type="text" placeholder="Enter new user name" className="input input-bordered w-full max-w-xs"/>
						</div>
						<div className="form-control w-full max-w-xs">
							<label className="label">
								<span className="label-text">Password</span>
								<span id="editUserPasswordError" className="label-text-alt hidden">Passwords must match</span>
							</label>
							<input name="password" id="editUserPassword" onChange={handlePassword} type="password" placeholder="Enter new password" className="input input-bordered w-full max-w-xs"/>
						</div>
						<div className="form-control w-full max-w-xs">
							<label className="label">
								<span className="label-text">Retype Password</span>
							</label>
							<input name="retypePassword" id="editUserRetypePassword" onChange={handlePassword} type="password" placeholder="Retype password" className="input input-bordered w-full max-w-xs"/>
						</div>
						<button type="submit" className="btn btn-outline">Submit</button>
					</div>
					: <div></div>
				}
			</form>
			<input type="checkbox" id="editUserLoadingModal" className="modal-toggle" />
			<div className="modal">
				{!postResponse ?
					<div className="modal-box p-0 w-min h-min bg-transparent">
						<span className="loading loading-spinner loading-lg"></span>
					</div>
					:
					<div className="modal-box">
						{postResponse === "success" ?
							<div>
								<h3 className="font-bold text-lg">Success</h3>
								<div className="modal-action">
									<label htmlFor="editUserLoadingModal" onClick={usersResponse.mutate} className="btn">Close</label>
								</div>
							</div>
							:
							<div>
								<h3 className="font-bold text-lg">Error</h3>
								<div className="modal-action">
									<label htmlFor="editUserLoadingModal" className="btn">Close</label>
								</div>
							</div>
						}
					</div>
				}
			</div>
		</div>
	);
}