import jwt, { type SignOptions } from 'jsonwebtoken';
import { config } from '../config/env.js';
import type { UserRole } from '../constants/ROLES.js';

export interface UserPayload {
    id: string;
    email: string;
    role: UserRole;
}

export const generateToken = (payload: UserPayload) => {
    return jwt.sign(payload, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRES_IN || '7d',
    } as SignOptions);
};

export const verifyToken = (token: string): UserPayload => {
    return jwt.verify(token, config.JWT_SECRET) as UserPayload;
};

export const durationToMs = (input?: string): number => {
    const duration = input || config.JWT_EXPIRES_IN || '7d';
    const match = duration.match(/^(\d+)([dhm])$/);

    if (!match || !match[1] || !match[2]) {
        throw new Error("Invalid format. Use formats like '7d', '4h', '10m'");
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    const multipliers: Record<string, number> = {
        d: 24 * 60 * 60 * 1000, // days to ms
        h: 60 * 60 * 1000,
        m: 60 * 1000,
    };

    return value * (multipliers[unit] ?? 7 * 24 * 60 * 60 * 1000);
};

export const durationToSeconds = (input?: string): number => {
    return Math.floor(durationToMs(input) / 1000);
};
