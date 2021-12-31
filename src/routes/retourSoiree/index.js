import { connectToDatabase } from '$lib/db';
import { ObjectId } from 'mongodb';

export async function get(request) {
	try {
		const soiree = request.query.get('soiree');
		const soireeY = soiree.substring(0, 4);
		const soireeM = soiree.substring(5, 7);
		const soireeD = soiree.substring(8, 10);
		console.log('ISO ' + soireeY.concat(soireeM).concat(soireeD));
		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('RetourSoirees');
		const coll2 = db.collection('CalendrierBenevoles');
		const retourSoiree = await collection
			.find({ soiree: soireeY.concat(soireeM).concat(soireeD) })
			.toArray();
		const benevoles = await coll2.distinct('benevole', {
			soiree: soireeY.concat(soireeM).concat(soireeD),
			statut: 'Oui'
		});
		//	.toArray();
		//		console.log('retourSoiree : ' + retourSoiree);
		console.log('benevoles : ' + benevoles);
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
				erreur: err
			}
		};
	}
}

export async function post(request) {}

export async function put(request) {
	try {
		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('RetourSoirees');
		const coll2 = db.collection('CalendrierBenevoles');
		const retourSoiree = JSON.parse(request.body);
		console.log('************');
		await collection.updateOne(
			{ soiree: retourSoiree.soiree },
			{
				$set: {
					rs: retourSoiree.rs,
					nbGare: retourSoiree.nbGare,
					nbPeri: retourSoiree.nbPeri,
					commentaires: retourSoiree.commentaires
				}
			}
		);

		for (var i = 0; i < retourSoiree.benevoles.length; i++) {
			if (retourSoiree.benevoles[i].statut === 'Non') {
				retourSoiree.benevoles[i].statut = 'Absent';
				await coll2.updateMany(
					{ benevole: retourSoiree.benevoles[i].benevole, soiree: retourSoiree.soiree },
					{ $set: { statut: retourSoiree.benevoles[i].statut } }
				);
			}
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

export async function del(request) {}
