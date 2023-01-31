import { connectToDatabase } from '$lib/db';
import { ObjectId } from 'mongodb';
import { YYYYMM, YYYYMMDD } from '$lib/date_functions';

export async function get(request) {
	// récupère le nombre d'absences par bénévoles depuis 1 an
	const equipe = request.query.get('equipe');
	try {
		const pipeline = [
			{
				$lookup: {
					from: 'Benevoles',
					localField: 'email',
					foreignField: 'email',
					as: 'ben'
				}
			},
			{
				$unwind: { path: '$ben' }
			},
			{ $set: { camion: '$ben.camion' } },
			{
				$match: {
					soiree: { $gte: YYYYMMDD(-1).date },
					statut: 'Absent',
					lieu: { $in: ['gp', 'gare'] },
					equipe: equipe,
					camion: true
				}
			},
			{
				$group: {
					_id: { benevole: '$benevole', soiree: '$soiree' }
				}
			},
			{
				$group: {
					_id: { benevole: '$_id.benevole' },
					absent: { $sum: 1 }
				}
			},
			{
				$sort: { absent: -1 }
			}
		];

		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('CalendrierBenevoles');
		const benevoles = await collection.aggregate(pipeline).toArray();

		return {
			status: 200,
			body: {
				benevoles
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
