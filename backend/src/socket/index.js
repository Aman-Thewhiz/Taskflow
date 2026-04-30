const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { getClientOrigin } = require("../config/env");

let io;

const initSocket = (httpServer) => {
  const clientOrigin = getClientOrigin();

  io = new Server(httpServer, {
    cors: {
      origin: clientOrigin,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication token missing"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      return next();
    } catch (error) {
      return next(new Error("Invalid authentication token"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.userId}`);
    console.log(`Socket connected: ${socket.id} user:${socket.userId}`);

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

const emitToAll = (event, payload) => {
  if (!io) {
    return;
  }

  io.emit(event, payload);
};

const emitToUser = (userId, event, payload) => {
  if (!io || !userId) {
    return;
  }

  io.to(`user:${userId}`).emit(event, payload);
};

module.exports = {
  initSocket,
  emitToAll,
  emitToUser,
};
