import { connectToDatabase } from '$lib/db';
import { ObjectId } from 'mongodb';
import { YYYYMM, YYYYMMDD } from '$lib/date_functions';

export async function get(request) {
	// récupère la dernière soirée des bénévoles
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
			{
				$match: {
					statut: {
						$in: ['RS', 'Oui', 'Vaisselle']
					},
					soiree: {
						$lte: YYYYMMDD().date
					}
				}
			},
			{
				$group: {
					_id: '$benevole',
					last_soiree: {
						$max: '$soiree'
					}
				}
			},
			{
				$sort: {
					last_soiree: 1
				}
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
