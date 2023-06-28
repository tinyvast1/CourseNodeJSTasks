const { Readable, Writable, Transform } = require('stream');

class Ui extends Readable {
    constructor(data, options = {objectMode: true}) {
        super(options);
        this.data = data;

        this.init();
    }

    init() {
        this.on('data', chunk => {
            if (chunk) {
                console.log('\x1b[33m', '\nПолучен новый пользователь\n', '\x1b[0m');
            }
        })
        
        this.on('error', type => {
            switch (type) {
                case 'TypeError':
                    console.log('\x1b[31m', '\nВ одном из полей получен неверный тип данных', '\x1b[0m');
                    break;
                
                case 'Don`t key':
                    console.log('\x1b[31m', '\n У пользвателя заполнены не все данные', '\x1b[0m');
                    break;

                case 'Don`t value':
                    console.log('\x1b[31m', '\n Данные пользователя заполнены некоректно', '\x1b[0m');
                    break;

                case 'Excess':
                    console.log('\x1b[31m', '\n У пользователя присутствуют лишние ключи или их не хватает', '\x1b[0m');
                    break;

                default:
                    break;
            }
            console.log('\x1b[31m', 'Пользователь отклонён\n', '\x1b[0m');

            this.resume();
        })
    }

    _read() {
        const data = this.data.shift()
        let error = false;
        
        if (data) {
            const values = Object.values(data.payload);
            const impotantKeys = ['name', 'email', 'password'];
            const keys = Object.keys(data.payload);

            values.forEach((value) => {
                if (typeof value !== 'string') {
                    this.emit('error', 'TypeError');
                    error = true;
                }
                if (!value) {
                    this.emit('error', 'Don`t value');
                    error = true;
                }
            })

            if (keys.length !== 3) {
                this.emit('error', 'Excess');
                error = true;
            }

            for (let key of impotantKeys) {
                if (!(keys.includes(key))) {
                    this.emit('error', 'Don`t key');
                    error = true;
                }
            }

            if (!error) {
                this.push(data);
            } else {
                this.push(false);
            }

        } else {
            this.push(null);
        }
    }
}

class Decryptor extends Transform {
    constructor(options = {objectMode: true}) {
        super(options);

        this.init();
    }

    init() {
        
        this.on('finish', () => {
            console.log('\x1b[35m', '\nВсе пользователи декодированны\n', '\x1b[0m');
        });
    }

    _transform(chunk, encoding, done) {
        if (chunk) {
            const methodDecode = ['hex', 'base64'];
            const tranformKey = ['email', 'password'];
            const transformChunk = {...chunk.payload};

            if (!methodDecode.includes(chunk.meta.algorithm)) {
                console.log('\x1b[31m', '\n Передан не тот метод декодирования', '\x1b[0m');
            } else {
                for(let key of tranformKey) {
                    transformChunk[key] = Buffer.from(transformChunk[key], chunk.meta.algorithm).toString();
                }

                this.push(transformChunk);
            }
        }

        done();
    }
}

class AccountManager extends Writable {
    constructor(options = {objectMode: true}) {
        super(options)
        this.users = [];
        this.init();
    }

    init() {
        this.on('finish', () => {
            console.log('\x1b[36m', '\nВсе пользователи записаны в хранилище\n', '\x1b[0m');
        })
    }

    _write(chunk, encoding, done) {
        this.users.push(chunk);
        console.log(chunk);
        done();
    }
}

const customers = [
    {
    payload: {
    name: 'Pitter Black',
    email: '70626c61636b40656d61696c2e636f6d',
    password: '70626c61636b5f313233'
    },
    meta: {
    algorithm: 'hex'
    }
    }
];
const ui = new Ui(customers);
const decryptor = new Decryptor();
const manager = new AccountManager();
ui.pipe(decryptor).pipe(manager);