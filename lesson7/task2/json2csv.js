const os = require('os')

module.exports = class json2csv {
    constructor(json) {
        this.json = json;
        this.first = true;
        this.csv = '';
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
        if (this.first) {
            this.csv += this.getKeys(this.json['0']).join(';') + os.EOL;
        }
        for(let item of this.json) {
            this.csv += this.getValues(item).join(';') + os.EOL;
        }
    }


}
