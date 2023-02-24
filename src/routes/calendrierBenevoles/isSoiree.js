import { connectToDatabase } from '$lib/db';
import { ObjectId } from 'mongodb';
import { date_YYYYMM } from '$lib/date_functions';

export async function get(request) {
	// récupération de
	try {
		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('CalendrierBenevoles');
		const soiree = request.query.get('soiree');
		const equipe = request.query.get('equipe');

		const soireeExiste = await collection.find({ soiree: soiree, equipe: equipe }).toArray();

		return {
			status: 200,
			body: soireeExiste
		};
	} catch (err) {
		return {
			status: 500,
			body: {
				erreur: err.message
			}
		};
	}
}
