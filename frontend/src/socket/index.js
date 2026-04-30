import { io } from "socket.io-client";

let socket;

const getSocketUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  return apiUrl.replace(/\/api\/?$/, "");
};

const ensureSocket = () => {
  if (!socket) {
    socket = io(getSocketUrl(), {
      autoConnect: false,
      withCredentials: true,
    });
  }

  return socket;
};

export const connectSocket = () => {
  const instance = ensureSocket();
  instance.auth = {
    token: localStorage.getItem("token"),
  };

  if (!instance.connected) {
    instance.connect();
  }
  return instance;
};

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
  }
};

export const getSocket = () => ensureSocket();
