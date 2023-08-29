import mysql from "mysql2/promise";
import { Post } from "../types/types";

export async function query({ query, values = [] }: { query: string, values?: Array<string>}) {
	const dbConn = await mysql.createConnection({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_NAME
	});

	try {
		const [results] = await dbConn.execute<Array<Post>>(query, values);
		dbConn.end();
		return results;
	} catch (err) {
		throw err;
	}
}