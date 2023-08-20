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
app.use('/api/chats', chatRoutes);

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

    socket.on('join rooms', ids => {
        socket.join(ids);
        console.log(`${socket.id} joined to: `, socket.rooms);
    });

    socket.on('group message', message => {
        io.to(message.chat).emit('receive message', message);
    });

    socket.on('private message', message => {   
        io.to(message.recipient[0]._id).to(message.recipient[1]._id).emit('receive message', message);
    });

    socket.on('create group', data => {
        (data.users).forEach(u => {
            io.to(u._id).emit('new group', data);
        });
    });
});