import express from "express";

import {createServer} from "node:http";
import{Server} from"socket.io";

import mongoose from "mongoose";
import { connectToSocket } from "./controllers/socketManger.js";

import cors from "cors";
import userRoutes from "./routes/users.routes.js"

const app =express();
const server=createServer(app);
const io=connectToSocket(server);

app.set("port",(process.env.PORT||8000));

app.use(cors());
app.use(express.json({limit:"40kb"}));
app.use(express.urlencoded({limit:"40kb",extended:true}));

app.use("/api/v1/users",userRoutes);

const start=async()=>{
app.set("mongo_user")

    const connectionDb= await mongoose.connect("mongodb+srv://mandarp1110_db_user:Mandar123@cluster0.bd192t6.mongodb.net/");
    console.log(`MONGO Connected DB Host:${connectionDb.connection.host}`)
    server.listen(app.get("port"),()=>{
        console.log("Listening on Port 8000");
    });
}

start(); 