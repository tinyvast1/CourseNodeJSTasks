import winston from "winston"

export const infoReq = (req, res, next) => {
    const logger = winston.createLogger({
        level: 'debug',
        format: winston.format.simple(),
        transports: [
            new winston.transports.Console()
        ],
    });
    logger.debug(`${req.method}----${new Date()}----${typeof req.body === 'object' ? JSON.stringify(req.body): req.bod}`)

    next();
}