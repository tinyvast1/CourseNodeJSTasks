
const { Readable, Writable, Transform, pipeline } = require('stream');
const crypto = require('crypto')


class Ui extends Readable {
    constructor(data, options = {objectMode: true}) {
        super(options);
        this.data = data;

        this.init();

        this.fedya = 0;
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
            const values = Object.values(data)
            const impotantKeys = ['name', 'email', 'password'];
            const keys = Object.keys(data);

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

class Guardian extends Transform {
    constructor(chunk, options = {objectMode: true}) {
        super(options);
        this.chunk = chunk;
        this.init();

        this.password = 'UnzT0cm6';
        this.algorithm = 'aes-256-cbc';
    }

    init() {
        this.on('data', chunk => {
        })
        
        this.on('finish', () => {
            console.log('\x1b[35m', '\nВсе пользователи трансформированы\n', '\x1b[0m');
        });
    }

    _transform(chunk, encoding, done) {
        if (chunk) {
            const transformChunk = {
                meta: {
                    source: 'ui'
                },
                payload: {...chunk}
            };
    
            const transformKeys = ['email', 'password'];
            const secretKey = crypto.scryptSync(this.password, 'salt', 32);

            const iv = crypto.randomBytes(16);
            transformChunk.payload.iv = iv.toString('hex');
    
            for (let key of transformKeys) {
                const value = transformChunk.payload[key];


                const cipher = crypto.createCipheriv(this.algorithm, secretKey, iv);
    
                let encryptedValue = cipher.update(value, 'utf8', 'hex');
                encryptedValue += cipher.final('hex');
                transformChunk.payload[key] = encryptedValue;

            }
    
            this.push(transformChunk);
        }
        done();
    }
}

class AccountManager extends Writable {
    constructor(options = {objectMode: true}) {
        super(options)
        this.users = [];
        this.init();

        this.password = 'UnzT0cm6';
        this.algorithm = 'aes-256-cbc';
    }

    init() {
        this.on('finish', () => {
            console.log('\x1b[36m', '\nВсе пользователи записаны в хранилище\n', '\x1b[0m');
            
        })
    }

    _write(chunk, encoding, done) {
        const transformChunk = {...chunk};
        
        const transformKeys = ['email', 'password'];
        const secretKey = crypto.scryptSync(this.password, 'salt', 32);
        const iv = Buffer.from(transformChunk.payload.iv, 'hex');
        delete transformChunk.payload.iv

        for (let key of transformKeys) {
            const value = transformChunk.payload[key];
            const decipher = crypto.createDecipheriv(this.algorithm, secretKey, iv);

            let encryptedValue = decipher.update(value, 'hex', 'utf8');
            encryptedValue += decipher.final('utf8');

            transformChunk.payload[key] = encryptedValue;
        }

        this.users.push(chunk);
        done();
    }
}

const customers = [
    {
    name: 'Pitter Black',
    email: 'pblack@email.com',
    password: 'pblack_123'
    },
    {
    name: 'Oliver White',
    email: 'owhite@email.com',
    password: 'owhite_456'
    }
   ];
   const ui = new Ui(customers);
   const guardian = new Guardian();
   const manager = new AccountManager();

   pipeline(
    ui,
    guardian,
    manager,
    () => {
        console.log(manager.users)
    }
   )
