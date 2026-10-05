import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

const globalForMongo = globalThis as unknown as { mongo?: Promise<MongoClient> };
export default async function getMongoClient() {
	if (!uri) throw new Error("Missing MONGODB_URI");
	const clientPromise = globalForMongo.mongo ?? new MongoClient(uri).connect();
	if (process.env.NODE_ENV !== "production") globalForMongo.mongo = clientPromise;
	return clientPromise;
}

