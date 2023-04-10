import express from 'express';
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

// Websocket
import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import Message from './server/model/Message.js';

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
const wss = new WebSocketServer({server});
wss.on('connection', async (connection, req)=>{

    // read username and id from cookie
    const cookie = req.headers.cookie;
    if(cookie){
        const tokenString = cookie.split('; ').find(str=>str.startsWith('token='));
        if(tokenString){
            const token = tokenString.split('=')[1];
            try {
                const decoded = jwt.verify(token, process.env.JWT_KEY);
                connection._id = decoded._id;
                connection.username = decoded.username;
            } catch (err) {
                throw err;
            }
        }
    }

    // Message conversation
    connection.on('message', async (message)=>{
        message = JSON.parse(message.toString());
        const {sender, recipient, text} = message;
        const messageDoc = await Message.create({sender, recipient, text});

        // Send message to recipient
        [...wss.clients].filter(c=>c._id===recipient || c._id===sender)
            .forEach(c=>c.send(JSON.stringify({
                message: {
                    _id: messageDoc._id,
                    sender,
                    recipient,
                    text,
                }
            })));
    });

    // notify everyone about online people (when someone connect)
    [...wss.clients].forEach(client=>{
        client.send(JSON.stringify({
            online: [...wss.clients].map(c=>({_id: c._id, username: c.username}))
        }));
    });

    // notify everyone about online people (when someone disconnect)
    connection.on('close', ()=>{
        [...wss.clients].forEach(client=>{
            client.send(JSON.stringify({
                online: [...wss.clients].map(c=>({_id: c._id, username: c.username}))
            }));
        });
    });
});