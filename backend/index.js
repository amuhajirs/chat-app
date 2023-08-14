import express from 'express';
import { Server } from 'socket.io'
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { config } from 'dotenv';
config({path: '.env'})

import authRoutes from './server/routes/authRoutes.js';
import userRoutes from './server/routes/userRoutes.js';
import chatRoutes from './server/routes/chatRoutes.js';
import './server/database/connection.js';
import './server/config/cloudinary.js';

import path from 'path';
import { fileURLToPath } from 'url';

// import jwt from 'jsonwebtoken';
// import Message from './server/model/Message.js';

// Set __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001

// Parser
app.use(express.json());
app.use(cookieParser());

// Log
app.use(morgan('tiny'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

// FrontEnd / Static
app.use(express.static(path.join(__dirname, './build')));
app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, './build/index.html'));
});

const server = app.listen(port, () => {
    console.log(`Server running on [http://localhost:${port}]...`);
});

// WebSocket
const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: '*'
    }
});

io.on('connection', socket => {
    console.log(`${socket.id} connected`);

    socket.on('join all chats', chatsId => {
        socket.join(chatsId);
        console.log('User has joined the room:', chatsId);
    });

    socket.on('send message', message => {
        console.log(message);
        io.in(message.chat).emit('receive message', message);
    });
});