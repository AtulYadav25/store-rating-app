import type { UserPayload } from "../utils/jwt.js";
import type { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload | JwtPayload | string;
        }
    }
}
