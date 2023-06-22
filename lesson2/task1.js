class TimersManager {
    constructor() {
        this.timers = {};
        this.checkAdd = false;
        this.stackLog = [];
    }

    checkTypeof(a, type, key) {
        if (typeof a !== type) {
            throw new Error(`Неверный тип данных у поля ${key}, нужен тип данных ${type}`)
        }
        if1: if (a === false) {
            break if1;
        } else if (a == false) {
            throw new Error(`Поле ${key} отсутсвует или имеет значение приравнивающееся к false`)
        }
    }

    findKeyValue(obj, value) {
        return Object.keys(obj).find(key => obj[key] === value)
    }

    add(settings, ...args) {
        if (this.checkAdd === true) {
            throw new Error(`Нельзя запускать таймер после запуска`)
        }

        let {name, delay, interval, job} = settings;

        if(this.timers[name]) {
            throw new Error(`Таймер с таким именем уже есть`)
        }

        this.checkTypeof(name, 'string', this.findKeyValue(settings, name));
        this.checkTypeof(delay, 'number', this.findKeyValue(settings, delay));
        this.checkTypeof(interval, 'boolean', this.findKeyValue(settings, interval));
        this.checkTypeof(job, 'function', this.findKeyValue(settings, job));

        if (!(delay > 0) || !(delay <= 5000)) {;
            throw new Error(`Поле delay содержит недопустимые значение, допустимые значиния от 0 до 5000`)
        }

        const newSettings = {...settings};
        if (args.length > 0) {
            newSettings['args'] = args;
        }
        this.timers[name] = newSettings;

        return this
    }
    startTimer(timer) {
        timer = this.timers[timer]
        const {job, delay, interval, name} = timer
        let {args} = timer
        
        const writeLog = (job) => {
            let log = {name, int: args}
            new Promise((res, rej) => {
                try {
                    res(job(...args))
                } catch (error) {
                    rej(error)
                }
            })
            .then(res => log['out'] = res)
            .catch(rej => {
                log['out'] = undefined
                log['error'] = {};
                log.error['name'] = rej.name;
                log.error['message'] = rej.message;
                log.error['stack'] = rej.stack;
            })
            .finally(() => log['created'] = new Date())
            this.stackLog.push(log);
        }

        args = args ? args : []

        timer['timer'] = setTimeout(function jobs(){
            writeLog(job);
            if (interval) {
                timer['timer'] = setTimeout(jobs, delay);
            }
        }, delay)
    }
    stopTimer(timer) {
        timer = this.timers[timer].timer
        clearInterval(timer);
    }
    remove(id) {
        this.stopTimer(id);
        delete this.timers[id]
    }
    start() {
        let veryLongTimer = 0; 
        this.checkAdd = true;
        for(let timer in this.timers) {
            this.startTimer(timer)
            if (this.timers[timer].delay > veryLongTimer) {
                veryLongTimer = this.timers[timer].delay
            }
        }
        veryLongTimer += 10000;
        setTimeout(() => {
            this.stop();
            this.print();
        }, veryLongTimer)
    }
    stop() {
        for(let timer in this.timers) {
            this.stopTimer(timer);
        }
    }
    print() {
        console.log(this.stackLog);
    }
    pause(id) {
        this.stopTimer(id);
    }
   
    resume(id) {
        this.startTimer(id);
    }
   }
   const manager = new TimersManager();

   const t1 = {
    name: 't1',
    delay: 2000,
    interval: false,
    job: () => { console.log('t1') }
   };

   const t2 = {
    name: 't2',
    delay: 1500,
    interval: true,
    job: (a, b) => a + b
   };
   
   const t3 = {
    name: 't3',
    delay: 4000,
    interval: false,
    job: () => {throw new Error('We have a problem!')}
   };

   manager.add(t1);
   manager.add(t3)
   manager.add(t2, 1, 2);
   manager.start();
   console.log(1);
   manager.pause('t1');
   manager.resume('t1');