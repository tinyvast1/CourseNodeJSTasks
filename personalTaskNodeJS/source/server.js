// Core
import express from 'express';
import session from 'express-session'
import { getPassword } from './helpers/env';


//Routers
import * as routers from './routers';
import { errorsLog, infoReq } from './helpers/logger';
import bodyParser from 'body-parser';
import { NotFoundError } from './helpers/errors';

const app = express();
const sessionOptions = {
    key: 'user',
    secret: getPassword(),
    resave: false,
    rolling: true,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 15 * 60 * 1000
    }
};

app.use(bodyParser.json({limit: '100kb'}));
app.use(session(sessionOptions));

app.use('/login', routers.login);
app.use('/logout', routers.logout);
app.use('/users', routers.users);
app.use('/classes', routers.classes);
app.use('/lessons', routers.lessons);


app.all('*', (req, res, next) => {
    next(new NotFoundError(`A request was sent with the ${req.method} method to a non-existent address - ${req.url}`, 404, req));
})

if (process.env.NODE_ENV === 'development') {
    app.use(infoReq);
}

if (process.env.NODE_ENV !== 'test') {
    app.use(errorsLog);
}

export { app };
