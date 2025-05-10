// Handles database connection using Mongoose  
// Exports a function to connect the app to MongoDB


const mongoose = require("mongoose");
require("dotenv").config(); 

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error(" MONGO_URI is not defined in the .env file.");
        }

        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(` MongoDB Connected!!`);
        
    } catch (err) {
        console.error(` MongoDB Connection Failed: ${err.message}`);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
