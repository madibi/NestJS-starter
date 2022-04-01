import { EntityRepository, Repository } from "typeorm";
import { UserAvatar } from "../entities/user-avatar.entity";

@EntityRepository(UserAvatar)
export class UserAvatarRepository extends Repository<UserAvatar> {
}


