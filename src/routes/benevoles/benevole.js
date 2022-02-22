import { connectToDatabase } from '$lib/db';
import { ObjectId } from 'mongodb';
import { YYYYMM } from '$lib/date_functions';

export async function get(request) {
	// validation du login
	try {
		const email = request.query.get('email');
		const pwd = request.query.get('pwd');
		const rg = request.query.get('rg');
		const rm = request.query.get('rm');

		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('Benevoles');
		const benevole = await collection.findOne({ email: email });

		if (rg === 'Oui') {
			// pour les rg, il faut un mot de passe valide
			if (benevole.pwd === pwd) {
			} else {
				benevole.rg = 'Non';
			}
		}
		if (rm === 'Oui') {
			// pour les rg, il faut un mot de passe valide
			if (benevole.pwd === pwd) {
			} else {
				benevole.rm = 'Non';
			}
		}
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
		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('Benevoles');
		const benevole = JSON.parse(request.body);
		b = await collection.insertOne(benevole);

		//récupération des dates à venir
		const coll2 = db.collection('CalendrierBenevoles');
		// en fonction du profil du benevole
		if (benevole.camion === 'Oui') {
			let calendrier = await coll2
				.find({ soiree: { $gt: YYYYMM(0).date }, equipe: 'Camion' })
				.sort({ soiree: 1, plage: 1 })
				.toArray();
			let soirees = [
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
				obj.equipe = 'Camion';

				c = await coll2.insertOne(obj);
			}
		}

		if (benevole.maraude === 'Oui') {
			let calendrier = await coll2
				.find({ soiree: { $gt: YYYYMM(0).date }, equipe: 'Maraude' })
				.sort({ soiree: 1, plage: 1 })
				.toArray();
			let soirees = [
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
				obj.equipe = 'Maraude';

				c = await coll2.insertOne(obj);
			}
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
			{
				$set: {
					prenom: benevole.prenom,
					nom: benevole.nom,
					email: benevole.email,
					tel: benevole.tel,
					maraude: benevole.maraude,
					camion: benevole.camion
				}
			}
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
