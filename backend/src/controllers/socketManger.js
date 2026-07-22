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
    console.log("==================================");
    console.log("Socket Connected:", socket.id);

    socket.on("join-call", async (roomName, username) => {
      console.log("JOIN REQUEST");
      console.log("Room:", roomName);
      console.log("Username:", username);
      console.log("Socket:", socket.id);

      socket.room = roomName;
      socket.username = username || "Guest";

      socketIdToUsername[socket.id] = socket.username;
      timeOnline[socket.id] = new Date();

      socket.join(roomName);

      if (!connections[roomName]) {
        connections[roomName] = [];
      }

      if (!connections[roomName].includes(socket.id)) {
        connections[roomName].push(socket.id);
      }

      console.log("Users in room:", connections[roomName].length);
      console.log(connections);

      const roomUsernames = {};

      connections[roomName].forEach((id) => {
        roomUsernames[id] = socketIdToUsername[id];
      });

      io.to(roomName).emit(
        "user-joined",
        socket.id,
        connections[roomName],
        roomUsernames
      );

      try {
        let meeting = await Meeting.findOne({
          meetingCode: roomName,
          status: "active",
        });

        if (!meeting) {
          const user = await User.findOne({ username });

          meeting = new Meeting({
            meetingCode: roomName,
            creator: user ? user._id : null,
            creatorUsername: username,
            participants: [username],
            status: "active",
            date: new Date(),
          });
        } else {
          if (!meeting.participants.includes(username)) {
            meeting.participants.push(username);
          }
        }

        await meeting.save();
      } catch (err) {
        console.log(err);
      }

      if (messages[roomName]) {
        messages[roomName].forEach((msg) => {
          io.to(socket.id).emit(
            "chat-message",
            msg.data,
            msg.sender,
            msg["socket-id-sender"]
          );
        });
      }
    });

    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });

    socket.on("chat-message", (data, sender) => {
      const roomName = socket.room;

      if (!roomName) return;

      if (!messages[roomName]) {
        messages[roomName] = [];
      }

      messages[roomName].push({
        sender,
        data,
        "socket-id-sender": socket.id,
      });

      io.to(roomName).emit("chat-message", data, sender, socket.id);
    });

    socket.on("disconnect", async () => {
      console.log("Socket Disconnected:", socket.id);

      const roomName = socket.room;

      delete socketIdToUsername[socket.id];
      delete timeOnline[socket.id];

      if (!roomName) return;

      socket.to(roomName).emit("user-left", socket.id);

      if (connections[roomName]) {
        connections[roomName] = connections[roomName].filter(
          (id) => id !== socket.id
        );

        console.log(
          "Remaining users:",
          connections[roomName].length
        );

        if (connections[roomName].length === 0) {
          delete connections[roomName];
          delete messages[roomName];

          try {
            const meeting = await Meeting.findOne({
              meetingCode: roomName,
              status: "active",
            });

            if (meeting) {
              meeting.status = "completed";

              meeting.duration = Math.max(
                1,
                Math.round((Date.now() - meeting.date.getTime()) / 60000)
              );

              await meeting.save();
            }
          } catch (err) {
            console.log(err);
          }
        }
      }
    });
  });

  return io;
};