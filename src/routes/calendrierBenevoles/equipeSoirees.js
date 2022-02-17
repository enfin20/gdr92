import { connectToDatabase } from '$lib/db';
import { ObjectId } from 'mongodb';
import { date_YYYYMM } from '$lib/date_functions';

export async function get(request) {}

export async function put(request) {
	// désactivation d'un mois
	try {
		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('CalendrierBenevoles');
		console.log('On y est');

		await collection.updateMany({ soiree: { $regex: '202112' } }, { $rename: { type: 'equipe' } });

		return {
			status: 200,
			body: {
				message: 'Success'
			}
		};
	} catch (err) {
		return {
			status: 500,
			body: {
				error: 'Server error'
			}
		};
	}
}
