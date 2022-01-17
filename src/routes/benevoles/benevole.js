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
/* 
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
} */

export async function post(request) {
	// intégration d'un nouveau bénévole
	try {
		let currentYear = new Date().getFullYear();
		const currentMonth = new Date().getMonth() + 1;
		const currentDay = new Date().getDate();
		let normedMonth = '0';
		if (currentMonth <= 9) {
			normedMonth = normedMonth.concat(currentMonth);
		}

		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('Benevoles');
		const benevole = JSON.parse(request.body);
		b = await collection.insertOne(benevole);

		//récupération des dates à venir
		const coll2 = db.collection('CalendrierBenevoles');
		const calendrier = await coll2
			.find({ soiree: { $gt: currentYear.toString().concat(normedMonth).concat(currentDay) } })
			.sort({ soiree: 1, plage: 1 })
			.toArray();
		const soirees = [
			...new Set(calendrier.map((x) => x.soiree + ' / ' + x.plage + ' : ' + x.lieu))
		];
		for (var i = 0; i < soirees.length; i++) {
			var obj = new Object();
			obj.soiree = soirees[i].substring(0, soirees[i].indexOf(' /'));
			soirees[i] = soirees[i].substring(soirees[i].indexOf('/ ') + 2);
			obj.plage = soirees[i].substring(0, soirees[i].indexOf(' :'));
			soirees[i] = soirees[i].substring(soirees[i].indexOf(': ') + 2);
			obj.lieu = soirees[i];
			obj.benevole = benevole.prenom + ' ' + benevole.nom;
			obj.email = benevole.email;
			obj.b_id = b.insertedId.toString();
			obj.statut = '';

			c = await coll2.insertOne(obj);
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

export async function put(request) {
	try {
		const benevole = JSON.parse(request.body);
		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('Benevoles');
		const coll2 = db.collection('CalendrierBenevoles');

		await collection.updateOne(
			{ _id: ObjectId(benevole._id) },
			{ $set: { prenom: benevole.prenom, nom: benevole.nom, email: benevole.email } }
		);
		await coll2.update(
			{ b_id: benevole._id },
			{ $set: { benevole: benevole.prenom + ' ' + benevole.nom, email: benevole.email } }
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
				error: 'Server error'
			}
		};
	}
}

export async function del(request) {
	try {
		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('Benevoles');
		const b_id = JSON.parse(request.body);
		await collection.deleteOne({ _id: ObjectId(b_id) });
		const coll2 = db.collection('CalendrierBenevoles');
		await coll2.deleteMany({ b_id: b_id });

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