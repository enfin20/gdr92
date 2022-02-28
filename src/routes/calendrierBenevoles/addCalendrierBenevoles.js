import { connectToDatabase } from '$lib/db';
import { ObjectId } from 'mongodb';

export async function get(request) {
	// récupération du calendrier pour un benevole par email
	try {
		const email = request.query.get('email');

		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('CalendrierBenevoles');

		const calendrier = await collection
			.find({ email: email })
			.sort({ soiree: 1, plage: 1 })
			.toArray();

		return {
			status: 200,
			body: {
				calendrier
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

export async function post(request) {
	// ajout d'une occurence dans le calendrier (date + bénevole)
	try {
		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('CalendrierBenevoles');
		const calendrier = JSON.parse(request.body);
		await collection.insertOne(calendrier);

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
