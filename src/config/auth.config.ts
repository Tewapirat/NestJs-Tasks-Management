// jwt:
// secret
// exporesIn

import { registerAs } from "@nestjs/config";
import type { StringValue } from 'ms';

export interface AuthConfig{
    jwt:{
        secret:string;
        expiresIn:StringValue;
    };
}

export const authConfig = registerAs(
    'auth',
    (): AuthConfig =>({
    jwt:{
        secret:process.env.JWT_TOKEN as string,
        expiresIn:(process.env.JWT_EXPIRES_IN ?? '60')as StringValue,
    }
}))
