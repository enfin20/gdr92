import { connectToDatabase } from '$lib/db';
import { ObjectId } from 'mongodb';
import { YYYYMMDD, YYYYMMDD_1 } from '$lib/date_functions';

export async function get(request) {
	// récupération des données des anciennes soirees

	try {
		const equipe = request.query.get('equipe');
		// pour compter le nombre de présents par lieu
		const pipeline_presents = [
			{
				$match: {
					soiree: { $gte: YYYYMMDD_1().date, $lte: YYYYMMDD(0).date },
					statut: {
						$in: ['Oui', 'RS', 'Vaisselle']
					},
					lieu: {
						$in: ['gp', 'gare']
					},
					equipe: equipe
				}
			},
			{
				$group: {
					_id: {
						soiree: '$soiree',
						lieu: '$lieu'
					},
					present: {
						$sum: 1
					}
				}
			},
			{
				$sort: {
					_id: 1
				}
			}
		];

		// pour compter le nombre d'absents par lieu
		const pipeline_absents = [
			{
				$match: {
					soiree: { $gte: YYYYMMDD_1().date, $lte: YYYYMMDD(0).date },
					statut: 'Absent',
					lieu: {
						$in: ['gp', 'gare']
					},
					equipe: equipe
				}
			},
			{
				$group: {
					_id: {
						soiree: '$soiree',
						lieu: '$lieu'
					},
					absent: {
						$sum: 1
					}
				}
			},
			{
				$sort: {
					_id: 1
				}
			}
		];

		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('RetourSoirees');
		const coll2 = db.collection('CalendrierBenevoles');
		const retourSoirees = await collection
			.find({ soiree: { $gte: YYYYMMDD_1().date, $lte: YYYYMMDD(0).date } }, { equipe: equipe })
			.sort({ soiree: -1 })
			.toArray();

		const presents = await coll2.aggregate(pipeline_presents).toArray();
		const absents = await coll2.aggregate(pipeline_absents).toArray();

		// rajput des presents & absents à retour soirée
		for (var i = 0; i < retourSoirees.length; i++) {
			for (var j = 0; j < presents.length; j++) {
				if (retourSoirees[i].soiree === presents[j]._id.soiree) {
					if (presents[j]._id.lieu === 'gp') {
						retourSoirees[i].gp_present = presents[j].present;
					}
					if (presents[j]._id.lieu === 'gare') {
						retourSoirees[i].gare_present = presents[j].present;
					}
				}
			}
			if (retourSoirees[i].commentaires === undefined) {
				retourSoirees[i].commentaires = '';
			}
			retourSoirees[i].gp_absent = 0;
			retourSoirees[i].gare_absent = 0;
			for (var k = 0; k < absents.length; k++) {
				if (retourSoirees[i].soiree === absents[k]._id.soiree) {
					if (absents[k]._id.lieu === 'gp') {
						retourSoirees[i].gp_absent = absents[k].absent;
					}
					if (absents[k]._id.lieu === 'gare') {
						retourSoirees[i].gare_absent = absents[k].absent;
					}
				}
			}
		}

		return {
			status: 200,
			body: {
				retourSoirees: retourSoirees
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
	// ajout par le rg d'une nouvelle soirée avec champ à vide
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
				erreur: err.message
			}
		};
	}
}
