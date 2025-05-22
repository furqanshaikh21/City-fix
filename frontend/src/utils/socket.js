import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Make sure this matches backend
export default socket;
