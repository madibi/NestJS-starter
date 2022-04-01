import { Role } from './../../../../schema/user/models/enums/role.enum';
import { AccessTokenPayloadUserAgent } from './access-token-payload.-user-agent.class';

export class AccessTokenPayload {
    public userId: string = '00000000-0000-0000-0000-000000000000';
    public roles: Role[] = [];
    public claims: string | number[];
    public userAgent: AccessTokenPayloadUserAgent;
    public clientIp: string;
    public appId: string;

    hasRole(role: Role): boolean {
        return this.roles.includes(role);
    }
}