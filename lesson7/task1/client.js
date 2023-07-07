const { error } = require('console');
const dgram = require('dgram');

const PORT = process.env.PORT || 3333;
const HOST = process.env.HOST || '127.0.0.1';

const message = {
        name: 'del'
   }

const client = dgram.createSocket('udp4');

client.send(JSON.stringify(message), PORT, HOST, error => {
    if (error) throw error;

    client.on('message', (message, remoteInfo) => {
        try {
            console.log(JSON.parse(message.toString()));
        } catch (error) {
            console.log(message.toString())
        }
    })
})