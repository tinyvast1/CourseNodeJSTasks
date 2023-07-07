const { error } = require('console');
const dgram = require('dgram');
const { Transform, pipeline, Readable } = require('stream');
const fsp = require('fs').promises;
const fs = require('fs');
const PORT = process.env.PORT || 3333;
const HOST = process.env.HOST || '127.0.0.1';

const server = dgram.createSocket('udp4');
let errorMessage = '';

server.on('listening', () => {
    console.log(`Сервер запущен на ${PORT} порту`);
});

function findByFilterJson(user, filters) {
    let checked = true;
    for(let filter in filters) {
        if (user[filter] && filter !== 'id') {
            if (typeof filters[filter] !== typeof user[filter]) {
                errorMessage = `Поле ${filter} имеет недопустимый тип данных`;
                return false
            }
            
            if (typeof filters[filter] === 'object') {
                checked = findByFilterJson(user[filter], filters[filter]);
            } else {
                if (typeof filters[filter] === 'string') {
                    if (!user[filter].includes(filters[filter])) {
                        checked = false;
                    }
                } else {
                    errorMessage = `Поле ${filter} имеет недопустимый тип данных`;
                    return false
                }
            }
        } else {
            errorMessage = `Вы передаёте недопустимое поле - ${filter}`;
            return false
        }  
    }

    return checked;
}

fsp.readFile('../pdf_tasks/users.json', 'utf-8')
.then((res) => {
    return JSON.parse(res)
})
.then(json => {
    server.on('message', (message, remoteInfo) => {
        Promise.resolve(json.filter(obj => findByFilterJson(obj, JSON.parse(message.toString()))))
        .then(res => {
            const message = errorMessage ? errorMessage : JSON.stringify(res);
            errorMessage = '';
            server.send(message, remoteInfo.port, remoteInfo.address, error => {
                if (error) throw error;
            })
        })
    });
})
.catch((error) => console.log(error))

server.bind(PORT, HOST);