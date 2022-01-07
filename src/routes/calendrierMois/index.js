import { connectToDatabase } from '$lib/db';
import { ObjectId } from 'mongodb';

export async function get(request) {
	try {
		let currentYear = new Date().getFullYear();
		let currentMonth = new Date().getMonth() + 1;
		let normedMonth = '0';
		if (currentMonth <= 9) {
			normedMonth = normedMonth.concat(currentMonth);
		}
		console.log('filtre ' + currentYear.toString().concat(normedMonth).concat('00'));
		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('CalendrierBenevoles');
		const soirees = await collection
			.find({ soiree: { $gt: currentYear.toString().concat(normedMonth).concat('00') } })
			.sort({ soiree: 1 })
			.toArray();

		const tempMois = [...new Set(soirees.map((x) => x.soiree.substring(0, 6)))];
		var mois = [];
		mois.push(tempMois[1]);
		console.log('mois ' + mois);
		return {
			status: 200,
			body: {
				mois
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
