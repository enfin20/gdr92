import { connectToDatabase } from '$lib/db';
import { ObjectId } from 'mongodb';

export async function get(request) {
	try {
		const email = request.query.get('email');
		const pwd = request.query.get('pwd');
		const rg = request.query.get('rg');

		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('Benevoles');
		const benevole = await collection.findOne({ email: email });
		if (rg === 'Oui') {
			if (benevole.pwd === pwd) {
			} else {
				benevole.rg = 'Non';
			}
		}
		console.log('retour: ' + benevole.nom);

		return {
			status: 200,
			body: {
				benevole
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
		const collection = db.collection('Benevoles');
		const Benevoles = await collection.find().toArray();

		return {
			status: 200,
			body: {
				Benevoles
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

export async function put(request) {}

export async function del(request) {}
