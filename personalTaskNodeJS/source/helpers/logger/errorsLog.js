import winston from "winston"

const logger = winston.createLogger({
    level: 'error',
    format: winston.format.simple(),
    transports: [
        new winston.transports.File({filename: 'logs/errors.log'})
    ],
})

const loggerNotFoundErrors =  winston.createLogger({
    level: 'error',
    format: winston.format.simple(),
    transports: [
        new winston.transports.File({filename: 'logs/not_found_errors.log'})
    ],
})

const loggerValidationError =  winston.createLogger({
    level: 'error',
    format: winston.format.simple(),
    transports: [
        new winston.transports.File({filename: 'logs/validation_errors.log'})
    ],
})

export const errorsLog = (error, req, res, next) => {
    switch (error.name) {
        case 'ValidationError':
            loggerValidationError.error(`${new Date()} ${error.req.method}: ${error.req.url} ${error.message}\n${JSON.stringify(error.req.body)}`);
            break;
        case 'NotFoundError':
            loggerNotFoundErrors.error(`${new Date()} ${error.req.method}: ${error.req.url}`);
            break;
        default:
            logger.error(`${new Date()} ${error.name} ${error.message}`);
            break;
    }
    res.status(error.statusCode ? error.statusCode : 500).json({message: error.message})
}