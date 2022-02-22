import { connectToDatabase } from '$lib/db';
import { YYYYMMDD } from '$lib/date_functions';
import { ObjectId } from 'mongodb';
import { each } from 'svelte/internal';

export async function get(request) {
	// retourne le tableau des présences pour un mois donné
	// colonne: dates de soirées
	// ligne : bénévoles
	try {
		// récupération du mois à requêter ($regex : YYYYMM)
		const soiree = request.query.get('soiree');
		const equipe = request.query.get('equipe');

		//préparation du pipeline pour retrouver sur l'année en cours (getFullYear -1) le nombre de vaisselles et la date
		const filter = YYYYMMDD(-1).date;
		const pipeline = [
			{
				$match: {
					statut: 'Vaisselle',
					soiree: { $gte: filter }
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

		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('CalendrierBenevoles');
		const calendrier = await collection
			.find({ soiree: { $regex: soiree }, equipe: equipe })
			.sort({ benevole: 1, soiree: 1, plage: 1 })
			.toArray();
		// récupération des soirées
		const soirees = [...new Set(calendrier.map((x) => x.soiree + ' : ' + x.lieu))];
		// récupération des bénévoles
		const benevoles = [...new Set(calendrier.map((x) => x.benevole))];
		// récupération des vaisselles
		const vaisselle = await collection.aggregate(pipeline).toArray();

		// construction du tableau résultat
		var tableau = [];
		tableau.push(soirees);
		for (var i = 0; i < benevoles.length; i++) {
			var tab = [];
			// pour chaque bénévole, on lui attache le nb de vaisselles et la date de la dernière
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
			// nenevole enregistré dans la première cellule de chaque ligne
			tab.push(ben);

			// pour chaque bénévole et chaque date, on retrouve son statut pour la soirée
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
			// les statuts sont ensuite mis dans le tableau final
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
	// Mise à jour des statuts des bénévoles à partir du tableau de présence (calendrier)
	try {
		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('CalendrierBenevoles');
		const calendrier = JSON.parse(request.body);

		console.log(calendrier);
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
