import { connectToDatabase } from '$lib/db';
import { ObjectId } from 'mongodb';
import { date_YYYYMMDD } from '$lib/date_functions';

export async function get(request) {
	// vérification de la date
	try {
		const soiree = request.query.get('soiree');

		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('RetourSoirees');
		const retourSoirees = await collection
			.find({ soiree: date_YYYYMMDD(soiree).date, equipe: 'Camion' })
			.toArray();
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
