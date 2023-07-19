import Ajv from "ajv"
import { ValidationError } from "./errors";

export const validator = (schema) => (req, res, next) => {
    const ajv = new Ajv({allErrors: true});
    const validate = ajv.compile(schema);

    const valid = validate(req.body);

    if (valid) {
        return next();
    }

    const errors = validate.errors.map(({message}) => message).join(', ');

    throw new ValidationError(errors, 400, req);
}