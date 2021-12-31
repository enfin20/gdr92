import { connectToDatabase } from '$lib/db';
import { ObjectId } from 'mongodb';

export async function get(request) {
	try {
		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('RetourSoirees');
		const coll2 = db.collection('CalendrierBenevoles');
		const retourSoiree = await collection.find({ soiree: ISODate('2022-01-17') }).toArray();
		const ben = await collection.find({ soiree: ISODate('2022-01-17') }).toArray();
		const benevoles = [...new Set(ben.map((x) => x.benevole))];
		console.log('retourSoiree : ' + retourSoiree);
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

export async function put(request) {}

export async function del(request) {}
