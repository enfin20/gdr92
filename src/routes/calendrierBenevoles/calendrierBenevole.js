import { connectToDatabase } from '$lib/db';
import { ObjectId } from 'mongodb';
import { YYYYMM, YYYYMMDD } from '$lib/date_functions';

export async function get(request) {
	// récupération du mois suivant pour un bénévole (email)
	try {
		const email = request.query.get('email');
		const maraude = request.query.get('maraude');
		const camion = request.query.get('camion');
		let equipeFilter = [];
		if (camion) {
			equipeFilter.push('Camion');
		}
		if (maraude) {
			equipeFilter.push('Maraude');
		}

		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('CalendrierBenevoles');
		const calendrier = await collection
			.find({
				soiree: { $gt: YYYYMM(1).date.concat('00') },
				email: email,
				actif: { $ne: 'Non' },
				equipe: { $in: equipeFilter }
			})
			.sort({ soiree: 1, plage: 1 })
			.toArray();
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
				erreur: err.message
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
			await collection.updateOne(
				{ _id: ObjectId(calendrier[i]._id) },
				{ $set: { statut: calendrier[i].statut } }
			);
		}
		// récupère toutes les soirées de maraude, pour modifier le statut à 'Maraude' dans les autres lieux
		let pipeline = [
			{
				$match: {
					equipe: 'Camion',
					statut: {
						$in: ['Oui', 'Non']
					},
					email: calendrier[0].email,
					lieu: {
						$in: ['gp', 'gare']
					}
				}
			},
			{
				$lookup: {
					from: 'CalendrierBenevoles',
					let: {
						s: '$soiree',
						e: '$email'
					},
					pipeline: [
						{
							$match: {
								$expr: {
									$and: [
										{
											$eq: ['$soiree', '$$s']
										},
										{
											$eq: ['$email', '$$e']
										},
										{
											$eq: ['$statut', 'Oui']
										},
										{
											$eq: ['$equipe', 'Maraude']
										}
									]
								}
							}
						}
					],
					as: 'cb'
				}
			},
			{
				$unwind: {
					path: '$cb',
					preserveNullAndEmptyArrays: false
				}
			},
			{
				$project: {
					_id: 1
				}
			}
		];
		const soirees = await collection.aggregate(pipeline).toArray();
		for (var j = 0; j < soirees.length; j++) {
			await collection.updateOne(
				{ _id: ObjectId(soirees[j]._id) },
				{ $set: { statut: 'Maraude' } }
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
				erreur: err.message
			}
		};
	}
}
