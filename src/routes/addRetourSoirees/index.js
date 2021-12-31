import { connectToDatabase } from '$lib/db';
import { ObjectId } from 'mongodb';

export async function get(request) {
	try {
		const email = request.query.get('email');
		//console.log('email = ' + email);
		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('CalendrierBenevoles');

		const calendrier = await collection
			.find({ email: email, actif: 'Oui' })
			.sort({ soiree: 1, plage: 1 })
			.toArray();
		//console.log(calendrier);
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
				erreur: err
			}
		};
	}
}

export async function post(request) {
	try {
		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('RetourSoirees');
		const retourSoiree = JSON.parse(request.body);
		await collection.insertOne(retourSoiree);
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

export async function del(request) {}
