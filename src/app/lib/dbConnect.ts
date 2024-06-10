import mongoose from 'mongoose'

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {

    if (connection.isConnected) {
        console.log("Database is already connnected");
        return
    }

    try {
            const db = await mongoose.connect(process.env.MONGODB_URI || '' , {})

            connection.isConnected = db.connections[0].readyState

            console.log("DB connected successsfully");
            

    } catch (error) {

        console.log("db connnection failed!");
        
        process.exit()
    }
}

export default dbConnect