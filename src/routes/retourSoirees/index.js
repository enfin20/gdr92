import { connectToDatabase } from '$lib/db';
import { ObjectId } from 'mongodb';

export async function get(request) {
	try {
		let currentYear = new Date().getFullYear();
		let currentMonth = new Date().getMonth() + 1;
		if (currentMonth <= 9) {
			currentMonth = '0'.concat(currentMonth);
		}
		let currentDay = new Date().getDate();
		console.log('current date : ' + currentYear.toString().concat(currentMonth).concat(currentDay));

		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('RetourSoirees');
		const retourSoirees = await collection
			.find({ soiree: { $lt: currentYear.toString().concat(currentMonth).concat(currentDay) } })
			.sort({ soiree: -1 })
			.toArray();
		console.log('retourSoirees : ' + retourSoirees[0].nbGare);
		return {
			status: 200,
			body: {
				retourSoirees: retourSoirees
			}
		};
	} catch (err) {
		return {
			status: 500,
			body: {
				erreur: err
			}
		};
	}
}

export async function post(request) {}

export async function put(request) {}

export async function del(request) {}
