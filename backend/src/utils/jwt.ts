import jwt, { type SignOptions } from 'jsonwebtoken';
import { config } from '../config/env.js';

export interface UserPayload {
    id: string;
    email: string;
    role: string;
}

export const generateToken = (payload: UserPayload) => {
    return jwt.sign(payload, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRES_IN || '7d',
    } as SignOptions);
};

export const verifyToken = (token: string): UserPayload => {
    return jwt.verify(token, config.JWT_SECRET) as UserPayload;
};



