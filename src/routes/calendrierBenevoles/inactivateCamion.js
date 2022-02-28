import { connectToDatabase } from '$lib/db';
import { ObjectId } from 'mongodb';
import { date_YYYYMM } from '$lib/date_functions';

export async function put(request) {
	// désactivation d'un mois
	try {
		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('CalendrierBenevoles');
		const soiree = JSON.parse(request.body);
		console.log('soiree ' + soiree);

		await collection.update(
			{ soiree: { $regex: date_YYYYMM(soiree).date }, equipe: 'Camion' },
			{ $set: { actif: 'Non' } }
		);

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
				erreur: err.message
			}
		};
	}
}
