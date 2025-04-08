import mongoose, { Mongoose } from "mongoose";
const MONGOGDB_URI = process.env.MONGODB_URI as string;

if(!MONGOGDB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}
interface mongooseCache{
    conn: Mongoose|null,
    promise: Promise<Mongoose>|null,
}

declare global { var mongoose: mongooseCache}
let cached = global.mongoose;
if(!cached){
    cached =global.mongoose = { conn: null, promise: null };
}
const dbConnect = async (): Promise<Mongoose>=>{
if(cached.conn){
    return cached.conn;
}
if(!cached.promise){
    cached.promise=mongoose.connect(MONGOGDB_URI,{
        dbName:"divflow"
    }).then((result)=>{
        console.log("MongoDB connected");
        return result;
        
    }).catch((err)=>{
        console.log("MongoDB connection error", err);
        throw err;
    })
}
cached.conn=await cached.promise;
return cached.conn;
}
export default dbConnect;