import { ValidationError } from '../errors';

export const getDbPort = () => {
    const { DB_PORT } = process.env;

    if (!DB_PORT) {
        throw new ValidationError('Environment variable DB_PORT should be specified');
    }

    if (typeof parseInt(DB_PORT, 10) !== 'number') {
        throw new ValidationError('Environment variable DB_PORT should be a string');
    }

    return DB_PORT;
};
