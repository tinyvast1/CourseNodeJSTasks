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
            this.addBalance(personId, value)
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
            this.removeBalance(personId, value);
        })
        this.on('send', (sender, recipient, value) => {
            this.checkId(sender);
            this.checkId(recipient);
            this.checkNegativeValue(value);
            this.removeBalance(sender, value);
            this.addBalance(recipient, value);
        })
    }

    addBalance(id, value) {
        this.persons[id].balance += value;
    }

    removeBalance(id, value) {
        this.checkNegativeValue(this.persons[id].balance - value);
        this.persons[id].balance -= value;
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
const personFirstId = bank.register({
    name: 'Pitter Black',
    balance: 100
});
const personSecondId = bank.register({
    name: 'Oliver White',
    balance: 700
});
bank.emit('send', personFirstId, personSecondId, 99);
bank.emit('get', personSecondId, (balance) => {
    console.log(`I have ${balance}₴`); // I have 750₴
});

console.log(bank.persons);