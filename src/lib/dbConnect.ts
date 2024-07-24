import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {};


async function dbConnect(): Promise<void> {

    if (connection.isConnected){
        console.log("Database already connected");
        return;
    }

    try {
        const db = await mongoose.connect("mongodb+srv://sarvagyaacharya:Sarvagya%401234@cluster0.fyiyfyj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" || '', {});
        connection.isConnected = db.connections[0].readyState;
    } catch (error) {
        console.log("DB connection falied", error);
        process.exit(1);
    }
}

export default dbConnect;