const fs = require('fs/promises');
const { Transform, pipeline } = require('stream');
const path = require('path');
const os = require('os');
const { error } = require('console');

class json2csv {
    constructor(json, importantFields = []) {
        this.json = json;
        this.first = true;
        this.csv = '';
        this.importantFields = importantFields;

        this.init();
    }

    init() {
        if (this.first) {
            let keys = Object.keys(this.json['0']);
            if (this.importantFields.length > 0) {
                keys = keys.filter(item => {
                    return this.importantFields.includes(item)
                });
            }
            this.csv += keys.join(';') + os.EOL;
        }
        for(let item of this.json) {
            let value = [];
            const entries = Object.entries(item).forEach(item => {
                if (this.importantFields.includes(item[0]) || !(this.importantFields.length > 0)) {
                    if (typeof item[1] === 'string') {
                        value.push(item[1].replace(/\n/g, ' '));
                    } else {
                        value.push(item[1]);
                    }
                } 
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
        new json2csv(JSON.parse(res), ['postId', 'name', 'body'])
    })
    .catch(error => console.log(error))