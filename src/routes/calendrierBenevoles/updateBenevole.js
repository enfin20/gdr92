import { connectToDatabase } from '$lib/db';
import { ObjectId } from 'mongodb';

export async function get(request) {}

export async function put(request) {
	try {
		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('CalendrierBenevoles');
		const champ = JSON.parse(request.body);
		console.log('b_id: ' + champ._id + ' ' + champ.email);
		await collection.update({ email: champ.email }, { $set: { b_id: champ._id } });

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
export async function post(request) {}

export async function del(request) {}
