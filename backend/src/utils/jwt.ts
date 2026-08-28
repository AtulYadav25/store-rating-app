import jwt, { type SignOptions } from 'jsonwebtoken';
import { config } from '../config/env.js';

export const generateToken = (payload: {
    id: string;
    email: string;
    role: string;
}) => {
    return jwt.sign(payload, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRES_IN || '7d',
    } as SignOptions);
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, config.JWT_SECRET);
};



