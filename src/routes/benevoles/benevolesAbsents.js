import { connectToDatabase } from '$lib/db';
import { ObjectId } from 'mongodb';
import { YYYYMM, YYYYMMDD } from '$lib/date_functions';

export async function get(request) {
	// récupère la liste des email des bénéficiaires n'ayant pas répondu pour le mois suivant
	const equipe = request.query.get('equipe');
	try {
		const pipeline = [
			{
				$match: {
					soiree: { $gte: YYYYMMDD(-1).date },
					statut: 'Absent',
					lieu: { $in: ['gp', 'gare'] },
					equipe: equipe
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

		console.log('nb ' + benevoles.length);
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
