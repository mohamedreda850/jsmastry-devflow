import mongoose, { Mongoose } from "mongoose";
import logger from "./logger";
import "@/database";
const MONGOGDB_URI = process.env.MONGODB_URI as string;

if (!MONGOGDB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}
interface mongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongoose: mongooseCache;
}
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}
const dbConnect = async (): Promise<Mongoose> => {
  if (cached.conn) {
    logger.info("Using existing mongoose connection");
    return cached.conn;
  }

  // Add connection error handler
  mongoose.connection.on("error", (err) => {
    logger.error("MongoDB connection error:", err);
    cached.conn = null;
    cached.promise = null;
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDB disconnected");
    cached.conn = null;
    cached.promise = null;
  });

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGOGDB_URI, {
        dbName: "divflow",
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 30000,
        maxPoolSize: 10,
        minPoolSize: 5,
        retryWrites: true,
        retryReads: true,
      })
      .then((result) => {
        logger.info("Connected to MongoDB");
        return result;
      })
      .catch((err) => {
        logger.error("Error connecting to MongoDB", err);
        throw err;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
};
export default dbConnect;
