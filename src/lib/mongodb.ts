"use server";
import mongoose from "mongoose";

if (process.env.MONGOOSE_DEBUG === "true") {
  mongoose.set("debug", true);
}

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DBNAME = process.env.MONGODB_DBNAME;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not set");
}
if (!MONGODB_DBNAME) {
  throw new Error("MONGODB_DBNAME environment variable is not set");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectToDatabase() {
  if (cached.conn) return;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!, {
      dbName: MONGODB_DBNAME,
      bufferCommands: false,
      maxPoolSize: 500,
    });
  }

  cached.conn = await cached.promise;
}
