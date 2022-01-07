import { connectToDatabase } from '$lib/db';
import { ObjectId } from 'mongodb';

export async function get(request) {
	try {
		const soiree = request.query.get('soiree');
		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('CalendrierBenevoles');
		const calendrier = await collection
			.find({ soiree: { $gt: soiree } })
			.sort({ soiree: 1, plage: 1 })
			.toArray();
		const soirees = [...new Set(calendrier.map((x) => x.soiree + ' : ' + x.lieu))];
		const benevoles = [...new Set(calendrier.map((x) => x.benevole))];

		var tableau = [];
		tableau.push(soirees);

		for (var i = 0; i < benevoles.length; i++) {
			var tab = [];
			tab.push(benevoles[i]);
			for (var j = 0; j < soirees.length; j++) {
				for (var k = 0; k < calendrier.length; k++) {
					if (
						calendrier[k].benevole === benevoles[i] &&
						calendrier[k].soiree + ' : ' + calendrier[k].lieu === soirees[j]
					) {
						var obj = new Object();
						obj._id = calendrier[k]._id;
						if (calendrier[k].rs === 'Oui') {
							obj.presence = 'RS';
						} else {
							obj.presence = calendrier[k].statut;
						}

						tab.push(obj);
					}
				}
			}

			tableau.push(tab);
		}
		return {
			status: 200,
			body: {
				tableau
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
		console.log('Put calendrierBenevoles');
		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('CalendrierBenevoles');
		const calendrier = JSON.parse(request.body);
		console.log('************');
		console.log(calendrier);
		for (var i = 0; i < calendrier.length; i++) {
			//console.log(calendrier[i].soiree + ' ' + calendrier[i].plage);
			console.log(calendrier[i]._id);
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
