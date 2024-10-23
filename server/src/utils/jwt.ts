import { sign, verify } from "jsonwebtoken"

const JWT = {
    generate: (payload: string | Buffer | object) => {
        const token = sign(payload, process.env.JWT_SECRET!);
        return token;
    },
    verify: (token: string) => {
        const payload = verify(token, process.env.JWT_SECRET!);
        return payload;
    },
}

export default JWT;