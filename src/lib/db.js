import { MongoClient } from 'mongodb';

//const MONGODB_URI = process.env.MONGODB_URI; //'mongodb+srv://enfin:iRpLDsDY8iD3nNs@cluster0.qqdfc.mongodb.net/gdrColombes';
//const MONGODB_DB = process.env.MONGODB_DB; //'gdrColombes';

const MONGODB_URI = 'mongodb+srv://enfin:iRpLDsDY8iD3nNs@cluster0.qqdfc.mongodb.net/gdrColombes';
const MONGODB_DB = 'gdrColombes';
//const MONGODB_URI = 'mongodb+srv://enfin:iRpLDsDY8iD3nNs@cluster0.qqdfc.mongodb.net/gdrTest';
//const MONGODB_DB = 'gdrTest';

// check the MongoDB URI
if (!MONGODB_URI) {
	throw new Error('Define the MONGODB_URI environmental variable');
}

// check the MongoDB DB
if (!MONGODB_DB) {
	throw new Error('Define the MONGODB_DB environmental variable');
}

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
	// check the cached.
	if (cachedClient && cachedDb) {
		// load from cache
		return {
			client: cachedClient,
			db: cachedDb
		};
	}

	// set the connection options
	const opts = {
		useNewUrlParser: true,
		useUnifiedTopology: true
	};

	// Connect to cluster
	let client = new MongoClient(MONGODB_URI, opts);
	await client.connect();
	let db = client.db(MONGODB_DB);

	// set cache
	cachedClient = client;
	cachedDb = db;

	return {
		client: cachedClient,
		db: cachedDb
	};
}
