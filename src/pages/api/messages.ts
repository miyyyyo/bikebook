import { Server } from "socket.io";
import { createServer, IncomingMessage, ServerResponse } from "http";
import { NextApiRequest, NextApiResponse } from "next";

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Socket.io server");
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

type User = {
  room: string;
  id: string;
  name: string;
};

let allUsers: User[] = [];
let roomMessages: {
  [room: string]: { timestamp: number; username: string; message: string }[];
} = {};

io.on("connection", (socket) => {
  console.log("CONNECTED");
  socket.emit("me", socket.id);

  socket.on(
    "joinRoomOnConnect",
    (room: string, name: string, callback: () => void) => {
      socket.join(room);
      allUsers.push({ room, id: socket.id, name });
      callback();
      socket.emit("message", `You have joined the room: ${room}`);
      socket.to(room).emit("message", `A user has joined the room: ${room}`);

      const usersInRoom = allUsers.filter((user) => user.room === room);
      io.to(room).emit("usersInRoom", usersInRoom);
    }
  );

  socket.on("getUsersInRoom", (room: string) => {
    const usersInRoom = allUsers.filter((user) => user.room === room);
    socket.emit("usersInRoom", usersInRoom);
  });

  socket.on(
    "sendMessage",
    ({
      room,
      username,
      message,
    }: {
      room: string;
      username: string;
      message: string;
    }) => {
      const timestamp = Date.now();
      if (!roomMessages[room]) {
        roomMessages[room] = [];
      }
      roomMessages[room].push({ timestamp, username, message });
      io.to(room).emit("roomMessages", roomMessages[room]);
    }
  );

  socket.on(
    "getRoomMessages",
    (room: string, callback: (messages: any[]) => void) => {
      callback(roomMessages[room] || []);
    }
  );

  socket.on("disconnect", () => {
    const user = allUsers.find((user) => user.id === socket.id);
    allUsers = allUsers.filter((user) => user.id !== socket.id);
    if (user) {
      const usersInRoom = allUsers.filter((u) => u.room === user.room);
      io.to(user.room).emit("usersInRoom", usersInRoom);
    }
  });
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    server.listen(0, (err?: any) => {
      if (err) throw err;
      res.send({ status: "Socket.io server is running" });
    });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
