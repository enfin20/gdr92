import { connectToDatabase } from '$lib/db';
import { ObjectId } from 'mongodb';
import { YYYYMMDD } from '$lib/date_functions';

export async function get(request) {
	// récupération des données d'une soirée par date (YYYYMMDD)
	try {
		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('RetourSoirees');
		const retourSoirees = await collection
			.find({ soiree: { $lte: YYYYMMDD(0).date } })
			.sort({ soiree: -1 })
			.toArray();

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
				erreur: err
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
				error: 'Server error'
			}
		};
	}
}

export async function put(request) {}

export async function del(request) {}
