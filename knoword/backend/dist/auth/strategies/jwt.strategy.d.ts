import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { UserPayload } from '../interfaces';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private config;
    constructor(config: ConfigService);
    validate(payload: UserPayload): {
        sub: number;
    };
}
export {};
