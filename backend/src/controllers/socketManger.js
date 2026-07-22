import { Server } from "socket.io";
import { Meeting } from "../models/meeting.model.js";
import { User } from "../models/user.model.js";

let connections = {};
let messages = {};
let timeOnline = {};
let socketIdToUsername = {};

export const connectToSocket = (server) => {
    const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"],
        credentials: true,
    },
    });

    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        socket.on("join-call", async (roomName, username) => {
            socket.room = roomName;
            socket.username = username || "Guest";
            socketIdToUsername[socket.id] = socket.username;
            socket.join(roomName);

            if (connections[roomName] === undefined) {
                connections[roomName] = [];
            }
            if (!connections[roomName].includes(socket.id)) {
                connections[roomName].push(socket.id);
            }

            timeOnline[socket.id] = new Date();

            // Populate socket to username mapping for the room
            const roomUsernames = {};
            connections[roomName].forEach(id => {
                roomUsernames[id] = socketIdToUsername[id] || "Guest";
            });

            // Notify everyone in the room (including the joining socket)
            for (let a = 0; a < connections[roomName].length; a++) {
                io.to(connections[roomName][a]).emit("user-joined", socket.id, connections[roomName], roomUsernames);
            }

            // Sync meeting in database
            try {
                let meeting = await Meeting.findOne({ meetingCode: roomName, status: "active" });
                if (!meeting) {
                    const user = await User.findOne({ username });
                    meeting = new Meeting({
                        user_id: username,
                        meetingCode: roomName,
                        creator: user ? user._id : null,
                        creatorUsername: username,
                        participants: [username],
                        status: "active",
                        date: new Date()
                    });
                } else {
                    if (!meeting.participants.includes(username)) {
                        meeting.participants.push(username);
                    }
                }
                await meeting.save();
            } catch (err) {
                console.error("Database error in socket join-call:", err);
            }

            // Emit previous messages in the room to the new user
            if (messages[roomName] !== undefined) {
                for (let a = 0; a < messages[roomName].length; ++a) {
                    io.to(socket.id).emit(
                        "chat-message",
                        messages[roomName][a]['data'],
                        messages[roomName][a]['sender'],
                        messages[roomName][a]['socket-id-sender']
                    );
                }
            }
        });

        socket.on("signal", (toId, message) => {
            io.to(toId).emit("signal", socket.id, message);
        });

        socket.on("chat-message", (data, sender) => {
            const roomName = socket.room;
            if (roomName && connections[roomName]) {
                if (messages[roomName] === undefined) {
                    messages[roomName] = [];
                }

                messages[roomName].push({
                    sender: sender,
                    data: data,
                    "socket-id-sender": socket.id
                });

                console.log(`Message in room ${roomName} from ${sender}: ${data}`);

                // Broadcast chat message to the room
                io.to(roomName).emit("chat-message", data, sender, socket.id);
            }
        });

        socket.on("disconnect", async () => {
            console.log("Socket disconnected:", socket.id);
            const roomName = socket.room;
            const joinTime = timeOnline[socket.id];

            delete socketIdToUsername[socket.id];
            delete timeOnline[socket.id];

            if (roomName && connections[roomName]) {
                // Notify others in room
                socket.to(roomName).emit("user-left", socket.id);

                // Remove user from connection list
                const index = connections[roomName].indexOf(socket.id);
                if (index !== -1) {
                    connections[roomName].splice(index, 1);
                }

                // If room is empty, clean it up and update meeting status
                if (connections[roomName].length === 0) {
                    delete connections[roomName];
                    delete messages[roomName];

                    try {
                        const meeting = await Meeting.findOne({ meetingCode: roomName, status: "active" });
                        if (meeting && joinTime) {
                            const durationMs = Date.now() - meeting.date.getTime();
                            meeting.duration = Math.max(1, Math.round(durationMs / 60000)); // duration in minutes
                            meeting.status = "completed";
                            await meeting.save();
                            console.log(`Meeting ${roomName} marked completed. Duration: ${meeting.duration} mins`);
                        }
                    } catch (err) {
                        console.error("Error updating meeting on room empty:", err);
                    }
                }
            }
        });
    });

    return io;
};
