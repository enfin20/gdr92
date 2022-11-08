import { connectToDatabase } from '$lib/db';
import { ObjectId } from 'mongodb';
import { date_YYYYMMDD } from '$lib/date_functions';

export async function get(request) {
	// récupération des données d'une soirée à partir de la date
	try {
		const soiree = request.query.get('soiree');

		const pipeline = [
			{
				$match: {
					soiree: date_YYYYMMDD(soiree).date,
					statut: {
						$in: ['Oui', 'Vaisselle', 'RS']
					},
					equipe: 'Camion'
				}
			},
			{
				$group: {
					_id: null,
					email: {
						$addToSet: '$email'
					}
				}
			},
			{
				$lookup: {
					from: 'Benevoles',
					localField: 'email',
					foreignField: 'email',
					as: 'b'
				}
			},
			{
				$unwind: {
					path: '$b',
					preserveNullAndEmptyArrays: false
				}
			},
			{
				$addFields: {
					tel: '$b.tel',
					prenom: '$b.prenom',
					nom: '$b.nom',
					email: '$b.email'
				}
			},
			{
				$sort: {
					prenom: 1
				}
			}
		];

		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('RetourSoirees');
		const coll2 = db.collection('CalendrierBenevoles');
		const retourSoiree = await collection
			.find({ soiree: date_YYYYMMDD(soiree).date, equipe: 'Camion' })
			.toArray();
		const benevoles = await coll2.aggregate(pipeline).toArray();
		return {
			status: 200,
			body: {
				retourSoiree: retourSoiree,
				benevoles: benevoles
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

export async function put(request) {
	// MAJ du retour de soirée et des bénévoles absents
	try {
		const retourSoiree = JSON.parse(request.body);

		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('RetourSoirees');
		const coll2 = db.collection('CalendrierBenevoles');

		await collection.updateOne(
			{ soiree: retourSoiree.soiree, equipe: 'Camion' },
			{
				$set: {
					rs: retourSoiree.rs,
					nbGare: retourSoiree.nbGare,
					nbPeri: retourSoiree.nbPeri,
					commentaires: retourSoiree.commentaires
				}
			}
		);

		// mise à jour des statuts par bénévole
		for (var i = 0; i < retourSoiree.benevoles.length; i++) {
			if (retourSoiree.benevoles[i].statut === 'Non') {
				await coll2.updateMany(
					{
						benevole: retourSoiree.benevoles[i].benevole,
						soiree: retourSoiree.soiree,
						lieu: { $in: ['gare', 'gp'] },
						statut: { $in: ['Oui', 'Vaisselle'] }
					},
					{ $set: { statut: 'Absent' } }
				);
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
				erreur: err.message
			}
		};
	}
}
