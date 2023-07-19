import jwt from 'jsonwebtoken'
import { getPassword } from '../../../helpers/env'

const pass = getPassword();

export const post = (req, res) => {

    try {
        const [ type, data ] = req.header('authorization').split(' ');
        const [ email, password ] = Buffer.from(data, 'base64').toString().split(':');
        req.session.user = { email }
        res.status(204).json();
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}