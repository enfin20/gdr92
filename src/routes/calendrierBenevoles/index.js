import { connectToDatabase } from '$lib/db';
import { ObjectId } from 'mongodb';
import { each } from 'svelte/internal';

export async function get(request) {
	try {
		let lastYear = new Date().getFullYear() - 1;
		const currentMonth = new Date().getMonth() + 1;
		const currentDay = new Date().getDate();
		let normedMonth = '0';
		if (currentMonth <= 9) {
			normedMonth = normedMonth.concat(currentMonth);
		}

		const pipeline = [
			{
				$match: {
					statut: 'Vaisselle',
					soiree: { $gte: lastYear.toString().concat(normedMonth).concat(currentDay) }
				}
			},
			{
				$group: {
					_id: '$benevole',
					nbVaisselle: { $sum: 1 },
					lastVaisselle: { $max: '$soiree' }
				}
			}
		];

		const soiree = request.query.get('soiree');
		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('CalendrierBenevoles');
		const calendrier = await collection
			.find({ soiree: { $regex: soiree } })
			.sort({ benevole: 1, soiree: 1, plage: 1 })
			.toArray();
		const soirees = [...new Set(calendrier.map((x) => x.soiree + ' : ' + x.lieu))];
		const benevoles = [...new Set(calendrier.map((x) => x.benevole))];

		var tableau = [];
		tableau.push(soirees);

		const vaisselle = await collection.aggregate(pipeline).toArray();

		for (var i = 0; i < benevoles.length; i++) {
			var tab = [];
			var ben = new Object();
			ben.benevole = benevoles[i].substring(0, benevoles[i].indexOf(' ') + 2) + '.';
			ben.nbVaisselle = '';
			ben.lastVaisselle = '';
			for (var k = 0; k < vaisselle.length; k++) {
				if (benevoles[i] === vaisselle[k]._id) {
					ben.nbVaisselle = vaisselle[k].nbVaisselle;
					ben.lastVaisselle = vaisselle[k].lastVaisselle;
				}
			}
			tab.push(ben);

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

export async function del(request) {
	try {
		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('CalendrierBenevoles');
		const soiree = JSON.parse(request.body);
		console.log('soiree : ' + soiree);
		await collection.deleteMany({ soiree: { $regex: soiree } });

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
