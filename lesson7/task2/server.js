const dgram = require('dgram');
const json2csv = require('./json2csv');
const fsp = require('fs').promises;
const zlib = require('zlib');
const { error } = require('console');
const PORT = process.env.PORT || 3333;
const HOST = process.env.HOST || '127.0.0.1';
const server = dgram.createSocket('udp4');
let errorMessage = '';

server.on('listening', () => {
    console.log(`Сервер запущен на ${PORT} порту`);
});

function findByFilterJson(user, filters) {
    for(let filter in filters) {
        if (user[filter] && filter !== 'id') {
            if (typeof filters[filter] !== typeof user[filter]) {
                errorMessage = `Поле ${filter} имеет недопустимый тип данных`;
                return false
            }
            
            if (typeof filters[filter] === 'object') {
                if (!findByFilterJson(user[filter], filters[filter])) return false 
            } else {
                if (typeof filters[filter] === 'string') {
                    if (!user[filter].toLowerCase().includes(filters[filter].toLowerCase())) {
                        return false
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

    return true;
}

function jsonInBuffer(json) {
    return Buffer.from(JSON.stringify(json), 'utf-8')
}

fsp.readFile('../pdf_tasks/users.json', 'utf-8')
.then((res) => {
    console.log('Сервис готов к использованию')
    return JSON.parse(res)
})
.then(json => {
    server.on('message', (message, remoteInfo) => {
        const {filter, meta:{format, archive}} = JSON.parse(message.toString());
        const {port, address} = remoteInfo;
        const startTime = process.uptime();
        Promise.resolve(json.filter(obj => findByFilterJson(obj, filter)))
        .then(res => {
            console.log(`JSON отфильтровался за ${process.uptime() - startTime} секунд`)
            if (errorMessage) {
                return jsonInBuffer({type: 'error', message: errorMessage});
            } else {
                const csv = new json2csv(res);
                let newRes = jsonInBuffer({type: 'json', message: res});
                if (format === 'csv') {
                    csv.createCsv();
                    newRes = jsonInBuffer({type: 'csv', message: csv.csv});
                } else if (format) {
                    return `Поле format содержит неверный тип данных или строку отличную от csv`
                }
                if (typeof archive === 'boolean' && archive) {
                    zlib.gzip(newRes, (error, result) => {
                        server.send(result, port, address, (error) => {
                            if (error) throw error;
                        })
                    })
                    return false
                } else if (typeof archive !== 'boolean' && archive) {
                    return `Поле archive содержит неверный тип данных`
                }
                return newRes
            }
        })
        .then(message => {
            errorMessage = '';
            if (message) {
                server.send(message, port, address, (error) => {
                    if (error) throw error;
                })
            }
        })
    });
})
.catch((error) => console.log(error))

server.bind(PORT, HOST);