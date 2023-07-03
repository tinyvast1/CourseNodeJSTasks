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

    init() {
        if (this.first) {
            const keys = Object.keys(this.json['0']);
            this.csv += keys.join(';') + os.EOL;
        }
        for(let item of this.json) {
            const value = Object.values(item).map(item => {
                if (typeof item === 'string') {
                    return item.replace(/\n/g, ' ')
                }
                return item
            });
            this.csv += value.join(';') + os.EOL;
        }

        fs.writeFile('comments.csv', this.csv)
            .then(res => console.log('Создан файл csv'))
            .catch(error => console.log(error))
    }
}

let file;

fs.readFile('pdf_tasks/data/comments.json', {encoding: 'utf-8'})
    .then(res => {
        console.log('JSON прочитан')
        new json2csv(JSON.parse(res))
    })
    .catch(error => console.log(error))