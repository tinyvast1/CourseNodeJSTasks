import { getPassword } from "./env";

const password = getPassword();

export const authorization = (req, res, next) => {
    const { email } = req.session.user;
    if (email && req.headers.authorization === password) {
        next();
    } else {
        res.status(401).json({message: 'invalid password'})
        return 
    }
}