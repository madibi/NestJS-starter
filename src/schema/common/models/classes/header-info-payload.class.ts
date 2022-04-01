import { Role } from "./../../../../schema/user/models/enums/role.enum";

export class HeaderInfoPayload {
    public userId: string = '00000000-0000-0000-0000-000000000000';
    public roles: Role[] = [];

    hasRole(role: Role): boolean {
        return this.roles.includes(role);
    }
}