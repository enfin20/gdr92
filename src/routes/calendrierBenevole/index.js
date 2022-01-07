import { connectToDatabase } from '$lib/db';
import { ObjectId } from 'mongodb';

export async function get(request) {
	let currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth() + 1;
	let nextMonth = '0';
	if (currentMonth <= 9) {
		nextMonth = nextMonth.concat(currentMonth + 1);
	}
	// cas du mois de décembre
	if (currentMonth === 12) {
		currentYear = currentYear + 1;
		nextMonth = '01';
	}
	//	console.log('filtre : ' + currentYear.toString().concat(nextMonth));
	try {
		const email = request.query.get('email');
		//console.log('email = ' + email);
		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('CalendrierBenevoles');

		const calendrier = await collection
			.find({
				email: email,
				actif: 'Oui',
				soiree: { $regex: currentYear.toString().concat(nextMonth) }
			})
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

export async function put(request) {
	try {
		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('CalendrierBenevoles');
		const calendrier = JSON.parse(request.body);
		console.log('************');
		for (var i = 0; i < calendrier.length; i++) {
			console.log(calendrier[i].soiree + ' ' + calendrier[i].plage);
			await collection.update(
				{ _id: ObjectId(calendrier[i]._id) },
				{ $set: { statut: calendrier[i].statut } }
			);
		}
		console.log('************');
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
