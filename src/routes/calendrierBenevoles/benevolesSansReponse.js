import { connectToDatabase } from '$lib/db';
import { ObjectId } from 'mongodb';
import { YYYYMM } from '$lib/date_functions';

export async function get(request) {
	// récupère la liste des email des bénéficiaires n'ayant pas répondu pour le mois suivant
	const equipe = request.query.get('equipe');
	try {
		const pipeline = [
			{
				$match: {
					soiree: {
						$gte: YYYYMM(1).date.concat('00')
					},
					statut: '',
					equipe: equipe
				}
			},
			{
				$group: {
					_id: null,
					email: {
						$addToSet: '$email'
					}
				}
			}
		];

		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('CalendrierBenevoles');
		const ben = await collection.aggregate(pipeline).toArray();

		// supprime le premier élément (_id)
		var benevoles = ben[0].email.slice(',');

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
				erreur: err
			}
		};
	}
}

export async function put(request) {}

export async function post(request) {}

export async function del(request) {}
