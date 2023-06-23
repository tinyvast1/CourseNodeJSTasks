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
            this.checkLimit(personId, value)
            this.checkId(personId);
            this.checkNegativeValue(value);
            this.checkTypeof(value, 'number', 'value');
            this.removeBalance(personId, value);
        })
        this.on('send', (sender, recipient, value) => {
            this.checkLimit(sender, value)
            this.checkId(sender);
            this.checkId(recipient);
            this.checkNegativeValue(value);
            this.removeBalance(sender, value);
            this.addBalance(recipient, value);
        })
        this.on('changeLimit', (personId, cb) => {
            this.checkTypeof(cb, 'function', 'callback');
            this.persons[personId].limit = cb;
        })
    }

    addBalance(id, value) {
        this.persons[id].balance += value;
    }
    
    
    removeBalance(id, value) {
        this.checkNegativeValue(this.persons[id].balance - value);
        this.persons[id].balance -= value;
    }
    
    checkLimit(id, value) {
        if (!this.persons[id].limit(value, this.persons[id].balance, this.persons[id].balance - value)) {
            this.emit('error', () => {
                throw new Error(`Превышен лимит`);
            })
        }
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
const personId = bank.register({
    name: 'Oliver White',
    balance: 806,
limit: amount => amount < 10
});
bank.emit('withdraw', personId, 5);
bank.emit('get', personId, (amount) => {
    console.log(`I have ${amount}₴`); // I have 695₴
});
// // Вариант 1
// bank.emit('changeLimit', personId, (amount, currentBalance,
// updatedBalance) => {
//     return amount < 100 && updatedBalance > 700;
// });
// Вариант 2
bank.emit('changeLimit', personId, (amount, currentBalance,
updatedBalance) => {
    return amount < 120 && updatedBalance > 700 && currentBalance > 800;
});
// Вариант 3
bank.emit('changeLimit', personId, (amount, currentBalance) => {
    return currentBalance > 800;
});
// // Вариант 4
// bank.emit('changeLimit', personId, (amount, currentBalance,
// updatedBalance) => {
//     return updatedBalance > 900;
// });
bank.emit('withdraw', personId, 100); // Error
    
console.log(bank.persons);