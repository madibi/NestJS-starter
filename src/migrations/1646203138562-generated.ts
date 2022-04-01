import {MigrationInterface, QueryRunner} from "typeorm";

export class generated1646203138562 implements MigrationInterface {
    name = 'generated1646203138562'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "COMMON"."EndPoint" ("id" BIGSERIAL NOT NULL, "controller" character varying NOT NULL, "method" character varying NOT NULL, "verb" character varying NOT NULL, "code" character varying NOT NULL, CONSTRAINT "endPointUniqueController&Method&Verb" UNIQUE ("controller", "method", "verb"), CONSTRAINT "endPointUniqueCode" UNIQUE ("code"), CONSTRAINT "PK_577d992e6068e48d8e10f63b463" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "COMMON"."EndPointGroup" ("id" BIGSERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "endPointGroupUniqueName" UNIQUE ("name"), CONSTRAINT "PK_5b9483b9fc0b33f1c74d808fcfb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "COMMON"."Image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "path" character varying NOT NULL, "width" integer, "height" integer, "averageColor" character varying, "size" integer, "extension" character varying, "mimeType" character varying, CONSTRAINT "UQ_af18c49714467352aea1ed9197b" UNIQUE ("path"), CONSTRAINT "imageUniquePath" UNIQUE ("path"), CONSTRAINT "PK_ddecd6b02f6dd0d3d10a0a74717" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "COMMON"."IP" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ip" character varying NOT NULL, "isAllow" boolean, "isDisAllow" boolean, CONSTRAINT "UQ_8f83da3d6a60a83c47716cfd789" UNIQUE ("ip"), CONSTRAINT "ipAllowOrDisAllow" CHECK (("isAllow" = 'true' AND "isDisAllow" != 'true') OR ("isDisAllow" = 'true' AND "isAllow" != 'true')), CONSTRAINT "PK_1e32efe7f901cb9cfa871e5aef6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "COMMON"."Language" ("id" BIGSERIAL NOT NULL, "name" character varying NOT NULL, "languageCode" character varying NOT NULL, "languageLocale" character varying NOT NULL, "phonePrefix" character varying NOT NULL, "flagUrl" character varying NOT NULL, "direction" character varying NOT NULL, "dateType" character varying NOT NULL, CONSTRAINT "languageUniquePath" UNIQUE ("name"), CONSTRAINT "PK_5abd0de610ce0c31b727f5547ec" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "COMMON"."RequestLimitation" ("id" BIGSERIAL NOT NULL, "endPointId" bigint NOT NULL, "numberPerMinute" integer NOT NULL, "isDisabled" boolean, CONSTRAINT "commonUniqueEndPointId" UNIQUE ("endPointId"), CONSTRAINT "PK_abc61c59ad4a1614b1917d89ba9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "COMMON"."Request" ("id" BIGSERIAL NOT NULL, "userId" character varying NOT NULL, "endPointId" bigint NOT NULL, "date" TIMESTAMP NOT NULL, CONSTRAINT "PK_23de24dc477765bcc099feae8e5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ENUM"."EnumOptionSample" ("id" BIGSERIAL NOT NULL, "nameKW" character varying, CONSTRAINT "PK_fbe663022bbeb395af6bd1ff9af" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ENUM"."EnumOptionSampleLocalize" ("id" BIGSERIAL NOT NULL, "name" character varying NOT NULL, "enumOptionSampleId" bigint, "languageId" bigint, CONSTRAINT "PK_2d57da4b85446af92d63dfcfd8f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "LOG"."Sms" ("id" BIGSERIAL NOT NULL, "phonePrefix" character varying, "mobileNumber" character varying, "sendingType" character varying, "content" character varying, "date" TIMESTAMP NOT NULL, CONSTRAINT "PK_81fd12d9a9fe37cde835d4beeee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "LOG"."Token" ("id" BIGSERIAL NOT NULL, "userId" uuid NOT NULL, "ip" character varying NOT NULL, "browseName" character varying NOT NULL, "osName" character varying NOT NULL, "cpuArchitecture" character varying NOT NULL, "appId" uuid NOT NULL, "date" date NOT NULL, CONSTRAINT "PK_206d2a22c0a6839d849fb7016b5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "USER"."Gender" ("id" BIGSERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "genderUniqueName" UNIQUE ("name"), CONSTRAINT "PK_4d15d0b8fd3d197ff93596e73ce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "USER"."Role" ("id" BIGSERIAL NOT NULL, "key" character varying NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_d80f547d4fb9fc2bf8ee43e00e7" UNIQUE ("key"), CONSTRAINT "userUniqueRoleName" UNIQUE ("name"), CONSTRAINT "PK_9309532197a7397548e341e5536" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "USER"."User" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "genderId" bigint, "phonePrefix" character varying, "mobileNumber" character varying, "emailAddress" character varying, "userName" character varying, "password" character varying, "firstName" character varying, "lastName" character varying, "phoneNumber" character varying, "address" character varying, "isMobileNumberVerified" boolean, "isEmailAddressVerified" boolean, "bio" character varying, "preferrerLanguageId" bigint NOT NULL, CONSTRAINT "UQ_c7a8d184ab23d7ebdc29453832a" UNIQUE ("emailAddress"), CONSTRAINT "UQ_58ca35d90f5ca194db65d775889" UNIQUE ("userName"), CONSTRAINT "userUniqueUserName" UNIQUE ("userName"), CONSTRAINT "userUniqueEmailAddress" UNIQUE ("emailAddress"), CONSTRAINT "userUniquePhonePrefix&MobileNumber" UNIQUE ("phonePrefix", "mobileNumber"), CONSTRAINT "REL_70cbbd0cb321c1ee239025f505" UNIQUE ("preferrerLanguageId"), CONSTRAINT "CHK_b8fe0dfe24a9bd82c6df1bbadb" CHECK (SUBSTR("phonePrefix",1,1) = '+'), CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "USER"."UserAvatar" ("id" BIGSERIAL NOT NULL, "userId" uuid NOT NULL, "imageId" uuid NOT NULL, CONSTRAINT "REL_589cf2055d71c9aecda29bafc7" UNIQUE ("imageId"), CONSTRAINT "PK_ab31ffe6eb9e871dc4ad138dd8e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "COMMON"."end_point_group_end_points_end_point" ("endPointGroupId" bigint NOT NULL, "endPointId" bigint NOT NULL, CONSTRAINT "PK_d4daae957866fd11e86c33c1596" PRIMARY KEY ("endPointGroupId", "endPointId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_28a33619de38d192a2af61ab3d" ON "COMMON"."end_point_group_end_points_end_point" ("endPointGroupId") `);
        await queryRunner.query(`CREATE INDEX "IDX_24a9c347df91cb02fd7a146b8d" ON "COMMON"."end_point_group_end_points_end_point" ("endPointId") `);
        await queryRunner.query(`CREATE TABLE "USER"."user_roles_role" ("userId" uuid NOT NULL, "roleId" bigint NOT NULL, CONSTRAINT "PK_b47cd6c84ee205ac5a713718292" PRIMARY KEY ("userId", "roleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5f9286e6c25594c6b88c108db7" ON "USER"."user_roles_role" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4be2f7adf862634f5f803d246b" ON "USER"."user_roles_role" ("roleId") `);
        await queryRunner.query(`CREATE TABLE "USER"."user_claims_end_point" ("userId" uuid NOT NULL, "endPointId" bigint NOT NULL, CONSTRAINT "PK_1c5ddce0ae9466534eb100fd4bd" PRIMARY KEY ("userId", "endPointId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6d82f03bde15383738400a6839" ON "USER"."user_claims_end_point" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_948b87ab7c3fd5c508fd6c388c" ON "USER"."user_claims_end_point" ("endPointId") `);
        await queryRunner.query(`CREATE TABLE "USER"."user_claim_groups_end_point_group" ("userId" uuid NOT NULL, "endPointGroupId" bigint NOT NULL, CONSTRAINT "PK_37b29b304ad82b25b0b950669fd" PRIMARY KEY ("userId", "endPointGroupId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4ca3b1665ac83fb687a7f55139" ON "USER"."user_claim_groups_end_point_group" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f4e6c966ce9431d05e140f83ac" ON "USER"."user_claim_groups_end_point_group" ("endPointGroupId") `);
        await queryRunner.query(`ALTER TABLE "ENUM"."EnumOptionSampleLocalize" ADD CONSTRAINT "FK_704cc143de67fab6e895b67bd87" FOREIGN KEY ("enumOptionSampleId") REFERENCES "ENUM"."EnumOptionSample"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ENUM"."EnumOptionSampleLocalize" ADD CONSTRAINT "FK_194fcee8b88e362094df600f77d" FOREIGN KEY ("languageId") REFERENCES "COMMON"."Language"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "USER"."User" ADD CONSTRAINT "FK_dab724639d0741cfc2b0d398d56" FOREIGN KEY ("genderId") REFERENCES "USER"."Gender"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "USER"."User" ADD CONSTRAINT "FK_70cbbd0cb321c1ee239025f505b" FOREIGN KEY ("preferrerLanguageId") REFERENCES "COMMON"."Language"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "USER"."UserAvatar" ADD CONSTRAINT "FK_8fa21ae076a21faf94bf39f443a" FOREIGN KEY ("userId") REFERENCES "USER"."User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "USER"."UserAvatar" ADD CONSTRAINT "FK_589cf2055d71c9aecda29bafc75" FOREIGN KEY ("imageId") REFERENCES "COMMON"."Image"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "COMMON"."end_point_group_end_points_end_point" ADD CONSTRAINT "FK_28a33619de38d192a2af61ab3d2" FOREIGN KEY ("endPointGroupId") REFERENCES "COMMON"."EndPointGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "COMMON"."end_point_group_end_points_end_point" ADD CONSTRAINT "FK_24a9c347df91cb02fd7a146b8de" FOREIGN KEY ("endPointId") REFERENCES "COMMON"."EndPoint"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "USER"."user_roles_role" ADD CONSTRAINT "FK_5f9286e6c25594c6b88c108db77" FOREIGN KEY ("userId") REFERENCES "USER"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "USER"."user_roles_role" ADD CONSTRAINT "FK_4be2f7adf862634f5f803d246b8" FOREIGN KEY ("roleId") REFERENCES "USER"."Role"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "USER"."user_claims_end_point" ADD CONSTRAINT "FK_6d82f03bde15383738400a6839e" FOREIGN KEY ("userId") REFERENCES "USER"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "USER"."user_claims_end_point" ADD CONSTRAINT "FK_948b87ab7c3fd5c508fd6c388ce" FOREIGN KEY ("endPointId") REFERENCES "COMMON"."EndPoint"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "USER"."user_claim_groups_end_point_group" ADD CONSTRAINT "FK_4ca3b1665ac83fb687a7f551397" FOREIGN KEY ("userId") REFERENCES "USER"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "USER"."user_claim_groups_end_point_group" ADD CONSTRAINT "FK_f4e6c966ce9431d05e140f83ac6" FOREIGN KEY ("endPointGroupId") REFERENCES "COMMON"."EndPointGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "USER"."user_claim_groups_end_point_group" DROP CONSTRAINT "FK_f4e6c966ce9431d05e140f83ac6"`);
        await queryRunner.query(`ALTER TABLE "USER"."user_claim_groups_end_point_group" DROP CONSTRAINT "FK_4ca3b1665ac83fb687a7f551397"`);
        await queryRunner.query(`ALTER TABLE "USER"."user_claims_end_point" DROP CONSTRAINT "FK_948b87ab7c3fd5c508fd6c388ce"`);
        await queryRunner.query(`ALTER TABLE "USER"."user_claims_end_point" DROP CONSTRAINT "FK_6d82f03bde15383738400a6839e"`);
        await queryRunner.query(`ALTER TABLE "USER"."user_roles_role" DROP CONSTRAINT "FK_4be2f7adf862634f5f803d246b8"`);
        await queryRunner.query(`ALTER TABLE "USER"."user_roles_role" DROP CONSTRAINT "FK_5f9286e6c25594c6b88c108db77"`);
        await queryRunner.query(`ALTER TABLE "COMMON"."end_point_group_end_points_end_point" DROP CONSTRAINT "FK_24a9c347df91cb02fd7a146b8de"`);
        await queryRunner.query(`ALTER TABLE "COMMON"."end_point_group_end_points_end_point" DROP CONSTRAINT "FK_28a33619de38d192a2af61ab3d2"`);
        await queryRunner.query(`ALTER TABLE "USER"."UserAvatar" DROP CONSTRAINT "FK_589cf2055d71c9aecda29bafc75"`);
        await queryRunner.query(`ALTER TABLE "USER"."UserAvatar" DROP CONSTRAINT "FK_8fa21ae076a21faf94bf39f443a"`);
        await queryRunner.query(`ALTER TABLE "USER"."User" DROP CONSTRAINT "FK_70cbbd0cb321c1ee239025f505b"`);
        await queryRunner.query(`ALTER TABLE "USER"."User" DROP CONSTRAINT "FK_dab724639d0741cfc2b0d398d56"`);
        await queryRunner.query(`ALTER TABLE "ENUM"."EnumOptionSampleLocalize" DROP CONSTRAINT "FK_194fcee8b88e362094df600f77d"`);
        await queryRunner.query(`ALTER TABLE "ENUM"."EnumOptionSampleLocalize" DROP CONSTRAINT "FK_704cc143de67fab6e895b67bd87"`);
        await queryRunner.query(`DROP INDEX "USER"."IDX_f4e6c966ce9431d05e140f83ac"`);
        await queryRunner.query(`DROP INDEX "USER"."IDX_4ca3b1665ac83fb687a7f55139"`);
        await queryRunner.query(`DROP TABLE "USER"."user_claim_groups_end_point_group"`);
        await queryRunner.query(`DROP INDEX "USER"."IDX_948b87ab7c3fd5c508fd6c388c"`);
        await queryRunner.query(`DROP INDEX "USER"."IDX_6d82f03bde15383738400a6839"`);
        await queryRunner.query(`DROP TABLE "USER"."user_claims_end_point"`);
        await queryRunner.query(`DROP INDEX "USER"."IDX_4be2f7adf862634f5f803d246b"`);
        await queryRunner.query(`DROP INDEX "USER"."IDX_5f9286e6c25594c6b88c108db7"`);
        await queryRunner.query(`DROP TABLE "USER"."user_roles_role"`);
        await queryRunner.query(`DROP INDEX "COMMON"."IDX_24a9c347df91cb02fd7a146b8d"`);
        await queryRunner.query(`DROP INDEX "COMMON"."IDX_28a33619de38d192a2af61ab3d"`);
        await queryRunner.query(`DROP TABLE "COMMON"."end_point_group_end_points_end_point"`);
        await queryRunner.query(`DROP TABLE "USER"."UserAvatar"`);
        await queryRunner.query(`DROP TABLE "USER"."User"`);
        await queryRunner.query(`DROP TABLE "USER"."Role"`);
        await queryRunner.query(`DROP TABLE "USER"."Gender"`);
        await queryRunner.query(`DROP TABLE "LOG"."Token"`);
        await queryRunner.query(`DROP TABLE "LOG"."Sms"`);
        await queryRunner.query(`DROP TABLE "ENUM"."EnumOptionSampleLocalize"`);
        await queryRunner.query(`DROP TABLE "ENUM"."EnumOptionSample"`);
        await queryRunner.query(`DROP TABLE "COMMON"."Request"`);
        await queryRunner.query(`DROP TABLE "COMMON"."RequestLimitation"`);
        await queryRunner.query(`DROP TABLE "COMMON"."Language"`);
        await queryRunner.query(`DROP TABLE "COMMON"."IP"`);
        await queryRunner.query(`DROP TABLE "COMMON"."Image"`);
        await queryRunner.query(`DROP TABLE "COMMON"."EndPointGroup"`);
        await queryRunner.query(`DROP TABLE "COMMON"."EndPoint"`);
    }

}
