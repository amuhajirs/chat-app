import mongoose from "mongoose";
import Message from "../model/Message.js";
import { config } from "dotenv";
config({path: '.env'});

mongoose.connect(process.env.MONGO_URI);
mongoose.connection.on('open', async ()=>{
    console.log('Database Connected');

    await Message.deleteMany();
    console.log('Message Cleared');

    mongoose.disconnect();
})