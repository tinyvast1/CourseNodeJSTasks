const fs = require('fs/promises');
const { Transform, pipeline } = require('stream');
const path = require('path');
const os = require('os');
const { error } = require('console');

class json2csv {
    constructor(json) {
        this.json = json;
        this.first = true;
        this.csv = '';
        this.init();
    }

    getKeys(obj) {
        let keys = []

        for (let key in obj) {
            if (typeof obj[key] === 'object') {
                keys = [...keys, ...this.getKeys(obj[key])]
            } else {
                keys.push(key)
            }
        }

        return keys
    }

    getValues(obj) {
        let values = [];
        for(let key in obj) {
            if (typeof obj[key] === 'object') {
                values = [...values, ...this.getValues(obj[key])]
            } else {
                if (typeof obj[key] === 'string') {
                    values.push(obj[key].replace(/\n/g, ' '));
                } else {
                    values.push(obj[key])
                }
                
            }
        }

        return values
    }

    createCsv() {
        init() {
            if (this.first) {
                this.csv += this.getKeys(this.json['0']).join(';') + os.EOL;
            }
            for(let item of this.json) {
                this.csv += this.getValues(item).join(';') + os.EOL;
            }
    
            fs.writeFile('comments.csv', this.csv)
                .then(res => console.log('Создан файл csv'))
                .catch(error => console.log(error))
        }
    }

}

let file;

fs.readFile('pdf_tasks/data/users.json', {encoding: 'utf-8'})
    .then(res => {
        console.log('JSON прочитан')
        new json2csv(JSON.parse(res))
    })
    .catch(error => console.log(error))