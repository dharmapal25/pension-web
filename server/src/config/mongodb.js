const mongoose = require("mongoose");


async function mongoDBConnection() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
        console.log("MongoDB connected")
    } catch (err) {
        console.log("Error DB connection fail: ", err)
    }
}

module.exports = mongoDBConnection