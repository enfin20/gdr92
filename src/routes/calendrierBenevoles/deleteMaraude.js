import { connectToDatabase } from '$lib/db';
import { YYYYMMDD } from '$lib/date_functions';
import { ObjectId } from 'mongodb';
import { each } from 'svelte/internal';

export async function get(request) {}

export async function put(request) {}

export async function post(request) {}

export async function del(request) {
	// Suppression d'un mois du calendrier (YYYYMM)
	try {
		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('CalendrierBenevoles');
		const soiree = JSON.parse(request.body);
		await collection.deleteMany({ soiree: { $regex: soiree }, equipe: 'Maraude' });

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
