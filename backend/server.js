import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

import connectDB from './config/db.js';
import complaintRoutes from './routes/complaintRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true, // Optional — only if using cookies or secure sessions
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/complaints', complaintRoutes);

app.use('/api/admin', adminRoutes); // ✅ Must be mounted


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🔥 Server running on port bro ${PORT}`));

export { io }; // Optional if you want to use io elsewhere
