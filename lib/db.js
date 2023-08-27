import mysql from 'mysql2/promise';

export async function query({ query, values = [] }) {
	const dbConn = await mysql.createConnection({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_NAME
	});

	try {
		const [results] = await dbConn.execute(query, values);
		dbConn.end();
		return results;
	} catch (err) {
		throw err;
	}
}