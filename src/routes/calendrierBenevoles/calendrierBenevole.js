import { connectToDatabase } from '$lib/db';
import { ObjectId } from 'mongodb';
import { YYYYMM } from '$lib/date_functions';

export async function get(request) {
	// récupération du mois suivant pour un bénévole (email)
	try {
		const email = request.query.get('email');
		const maraude = request.query.get('maraude');
		const camion = request.query.get('camion');
		let equipeFilter = [];
		if (camion === 'Oui') {
			equipeFilter.push('Camion');
		}
		if (maraude === 'Oui') {
			equipeFilter.push('Maraude');
		}
		console.log('equipe ' + equipeFilter + ' date ' + YYYYMM(1).date);
		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('CalendrierBenevoles');
		const calendrier = await collection
			.find({
				email: email,
				soiree: { $regex: YYYYMM(2).date },
				actif: { $ne: 'Non' },
				equipe: { $in: equipeFilter }
			})
			.sort({ soiree: 1, plage: 1 })
			.toArray();
		console.log('calendrier ' + calendrier.length);
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

export async function put(request) {
	// mise à jour des statuts du calendrier d'un bénévole (email)
	try {
		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('CalendrierBenevoles');
		const calendrier = JSON.parse(request.body);

		for (var i = 0; i < calendrier.length; i++) {
			await collection.update(
				{ _id: ObjectId(calendrier[i]._id) },
				{ $set: { statut: calendrier[i].statut } }
			);
		}

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

export async function post(request) {}

export async function del(request) {}
