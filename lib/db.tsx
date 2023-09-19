import mysql from "mysql2/promise";
import type { Table, Query } from "@/types/types";

// database functions
let globalPool: mysql.Pool | undefined = undefined;

async function getDBPool() {
	if(typeof globalPool !== 'undefined') {
		return globalPool;
	}

	if (process.env.NODE_ENV === 'production') {
		globalPool = await mysql.createPool({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME,
			connectionLimit: 10
		});
	} else {
		//@ts-ignore
		if (!global.globalPool) {
			//@ts-ignore
			global.globalPool = await mysql.createPool({
				host: process.env.DB_HOST,
				user: process.env.DB_USER,
				password: process.env.DB_PASS,
				database: process.env.DB_NAME,
				connectionLimit: 10
			});
		}
		//@ts-ignore
		globalPool = global.globalPool;
	}

	return globalPool;
}

export async function query({ queryStr, values = [] }: Query): Promise<Array<Table>> {
	const dbPool = await getDBPool();
	try {
		//@ts-ignore
		const [results] = await dbPool.query(queryStr, values);
		//@ts-ignore
		return results;
	} catch (err) {
		throw err;
	}
}

export async function transaction(callbacks: Array<(results?: Table) => Query>, errors: Array<() => void>) {
	const dbPool = await getDBPool();
	//@ts-ignore
	const dbConnection = await dbPool.getConnection();
	await dbConnection.query("START TRANSACTION");

	try {
		let results = {} as Table;
		for (const callback of callbacks) {
			const query = callback(results);
			//@ts-ignore
			[results] = await dbConnection.query(query.queryStr, query.values);
		}

		await dbConnection.query("COMMIT");
		dbConnection.release();
	} catch (err) {
		await dbConnection.query("ROLLBACK");
		errors.forEach((f) => f());
		dbConnection.release();
		throw err;
	}
}

//get functions
export async function getUser(username: string) {
	let userArr = await query({
		queryStr: "SELECT * from users WHERE name=?;",
		values: [username]
	});

	let user = userArr[0];

	return user;
}