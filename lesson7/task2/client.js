const dgram = require('dgram');
const fs = require('fs/promises');
const zlib = require('zlib')

const PORT = process.env.PORT || 3333;
const HOST = process.env.HOST || '127.0.0.1';

const filters = {
    filter: {
        name: { first: 'Nelda', last: 'Francis' },
        phone: '(872) 497-3401',
        address: {
          zip: '93416-7383',
          city: 'Lithium',
          country: 'Minnesota',
          street: '376 Delevan Street'
        },
        email: 'neldafrancis@isologix.com'
    },
    meta: {
        // format: 'csv',
        archive: true
    }
   }

const client = dgram.createSocket('udp4');

function unpackResponse(type, message) {
    switch (type) {
        case 'json':
            fs.writeFile('filtered.json', JSON.stringify(message))
            .then(console.log('Отфильтрованный json файл создан'))
            break;
        case 'csv':
            fs.writeFile('filtered.csv', message)
            .then(console.log('Отфильтрованный csv файл создан'))
        case 'error':
            console.log(message);
        default:
            break;
    }
}

client.send(JSON.stringify(filters), PORT, HOST, error => {
    if (error) throw error;
    client.on('message', (response, remoteInfo) => {
        try {
            const {type, message} = JSON.parse(response);
            unpackResponse(type, message);
        } catch (error) {
            zlib.gunzip(response, (error, result) => {
                const {type, message} = JSON.parse(result)
                unpackResponse(type, message);
            })
        }
    })
})