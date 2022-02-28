import { connectToDatabase } from '$lib/db';
import { ObjectId } from 'mongodb';

export async function get(request) {
	try {
		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('Benevoles');
		const benevoles = await collection.find().sort({ prenom: 1, nom: 1 }).toArray();

		return {
			status: 200,
			body: {
				benevoles
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
