import { connectToDatabase } from '$lib/db';
import { ObjectId } from 'mongodb';
import { YYYY0101 } from '$lib/date_functions';

export async function get(request) {
	// récupère la dernière soirée des bénévoles
	const equipe = request.query.get('equipe');
	try {
		const pipeline = [
			{
				$match: {
					statut: {
						$in: ['Vaisselle', 'Oui', 'RS']
					},
					equipe: equipe,
					lieu: {
						$in: ['gare', 'gp']
					},
					soiree: {
						$gt: YYYY0101(-1).date
					}
				}
			},
			{
				$group: {
					_id: {
						benevole: '$benevole',
						soiree: '$soiree'
					},
					nb: {
						$sum: 1
					}
				}
			},
			{
				$set: {
					benevole: '$_id.benevole',
					soiree: '$_id.soiree'
				}
			},
			{
				$unset: ['_id', 'nb']
			},
			{
				$sort: {
					benevole: 1,
					soiree: 1
				}
			}
		];

		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('CalendrierBenevoles');
		const presences = await collection.aggregate(pipeline).toArray();

		return {
			status: 200,
			body: {
				presences
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
