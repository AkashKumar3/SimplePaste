import mongoose from "mongoose";

/**
 * Safely extract MongoDB URI
 * (TypeScript-safe assertion)
 */
const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error("❌ MONGODB_URI is not defined in environment variables");
}

/**
 * Global cache to prevent multiple connections
 */
type MongooseCache = {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
};

declare global {
    // eslint-disable-next-line no-var
    var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache =
    global.mongoose ?? (global.mongoose = { conn: null, promise: null });

/**
 * Connect to MongoDB (serverless-safe)
 */
export async function connectDB(): Promise<typeof mongoose> {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
