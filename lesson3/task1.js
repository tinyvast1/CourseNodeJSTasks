const { error } = require('console');
const EventEmitter = require('events');
const { v4: uuidv4 } = require('uuid');

class Bank extends EventEmitter {
    constructor() {
        super();
        this.personsId = [];
        this.persons = [];
        this.on('add', (personId, value) => {
            this.checkId(personId);
            this.checkNegativeValue(value);
            this.checkTypeof(value, 'number', 'value');
            this.persons[personId].balance += value;
        })
        this.on('get', (personId, cb) => {
            this.checkId(personId);
            this.checkTypeof(cb, 'function', 'callback');
            cb(this.persons[personId].balance);
        })
        this.on('withdraw', (personId, value) => {
            this.checkId(personId);
            this.checkNegativeValue(value);
            this.checkTypeof(value, 'number', 'value');
            this.checkNegativeValue(this.persons[personId].balance - value);
            this.persons[personId].balance -= value;
        })
    }

    checkTypeof(name, type, key) {
        if (typeof name !== type) {
            this.emit('error', () => {
                throw new Error(`Неверный тип данных у поля ${key}`);
            })
        }
    }

    checkNegativeValue(value) {
        if (value <= 0) {
            this.emit('error', () => {
                throw new Error(`Получилось отрицательное значение`);
            })
        }
    }

    checkId(id) {
        if (!this.personsId.includes(id)) {
            this.emit('error', () => {
                throw new Error(`Такого пользователя не существует`);
            })
        }
    }
    
    register(person) {
        const {name, balance} = person;
        
        this.checkTypeof(name, 'string', 'name');
        this.checkTypeof(balance, 'number', 'balance');
        this.checkNegativeValue(balance);
        
        const personId = uuidv4();
        this.personsId.push(personId);
        this.persons[personId] = {...person};
        
        return personId
        
    }
}

const bank = new Bank();
bank.on('error', (cb) => {
    cb();
})

const personId = bank.register({
    name: 'Pitter Black',
    balance: 100
});


bank.emit('add', personId, 20);
bank.emit('get', personId, (balance) => {
 console.log(`I have ${balance}₴`); // I have 120₴
});
bank.emit('withdraw', personId, 50);
bank.emit('get', personId, (balance) => {
 console.log(`I have ${balance}₴`); // I have 70₴
});

console.log(personId);
console.log(bank.persons);