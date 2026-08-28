import type { UserPayload } from "../utils/jwt.js";

declare global {
    namespace Express {
        interface Request {
            user: UserPayload; //this gives `user` to all routes as gauranteed, not Optional just for convience
        }
    }
}
