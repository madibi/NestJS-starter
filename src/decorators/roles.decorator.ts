import { SetMetadata } from '@nestjs/common';
import { Role } from './../schema/user/models/enums/role.enum';

export type RolesClaimsParams = {
    roles?: Role[],
    claims?: number[]
 }

export const ROLES_KEY = 'roles';
export const CLAIMS_KEY = 'claims';
export const ROLES_CLAIMS_KEY = 'roles-claims';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
export const Claims = (...claims: number[]) => SetMetadata(CLAIMS_KEY, claims);
export const RolesClaims = ({roles, claims}: RolesClaimsParams) => {
    return SetMetadata(ROLES_CLAIMS_KEY, {
        roles,
        claims
    });
};