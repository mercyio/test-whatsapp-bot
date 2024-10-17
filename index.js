const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const Redis = require('ioredis');
const express = require('express');
const mongoose = require('mongoose');

const redis = new Redis();

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost/whatsapp_tracker', { useNewUrlParser: true, useUnifiedTopology: true });

const whatsapp = new Client({
    authStrategy: new LocalAuth(),   
});

whatsapp.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, { small: true });
});

whatsapp.on('ready', () => {
    console.log('Client is ready!');
});


let isFirstMessage = true;

let messagesCounts = 0;

whatsapp.on('message', async message => {
    try {
        messagesCounts++;

        if (isFirstMessage) {
            await message.reply("Hi pookie, How can I help you?");
            isFirstMessage = false;
        } else {
            await message.reply("Great! What else can I do for you?");
            isFirstMessage = true;
        }

        console.log("message count", messagesCounts);

    } catch (error) {
        console.log('Error handling message:', error);
    }
});



whatsapp.on('auth_failure', msg => {
    console.error('AUTHENTICATION FAILURE', msg);
});

whatsapp.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
});

whatsapp.initialize();
