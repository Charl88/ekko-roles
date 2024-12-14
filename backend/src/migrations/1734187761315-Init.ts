import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1734187761315 implements MigrationInterface {
    name = 'Init1734187761315'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "structures" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "parentId" integer, CONSTRAINT "PK_392d41b28d3ff6c67a9a93c9800" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "roleId" integer, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_structures_structures" ("usersId" integer NOT NULL, "structuresId" integer NOT NULL, CONSTRAINT "PK_a1f138ea6ab9a160e2e232ac116" PRIMARY KEY ("usersId", "structuresId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8ed8e56f36ab3fd0cce539e594" ON "users_structures_structures" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ed6073efac0fa1afca09af609d" ON "users_structures_structures" ("structuresId") `);
        await queryRunner.query(`CREATE TABLE "structures_closure" ("id_ancestor" integer NOT NULL, "id_descendant" integer NOT NULL, CONSTRAINT "PK_4b745b4fbd06302a54777c80740" PRIMARY KEY ("id_ancestor", "id_descendant"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b73936acad5e1fdfa5387a0b5f" ON "structures_closure" ("id_ancestor") `);
        await queryRunner.query(`CREATE INDEX "IDX_4eb9215469c95530c4842cd572" ON "structures_closure" ("id_descendant") `);
        await queryRunner.query(`ALTER TABLE "structures" ADD CONSTRAINT "FK_ef249bc7fc935ae9ff6ec8b7968" FOREIGN KEY ("parentId") REFERENCES "structures"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_368e146b785b574f42ae9e53d5e" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_structures_structures" ADD CONSTRAINT "FK_8ed8e56f36ab3fd0cce539e594d" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_structures_structures" ADD CONSTRAINT "FK_ed6073efac0fa1afca09af609df" FOREIGN KEY ("structuresId") REFERENCES "structures"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "structures_closure" ADD CONSTRAINT "FK_b73936acad5e1fdfa5387a0b5fb" FOREIGN KEY ("id_ancestor") REFERENCES "structures"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "structures_closure" ADD CONSTRAINT "FK_4eb9215469c95530c4842cd5724" FOREIGN KEY ("id_descendant") REFERENCES "structures"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "structures_closure" DROP CONSTRAINT "FK_4eb9215469c95530c4842cd5724"`);
        await queryRunner.query(`ALTER TABLE "structures_closure" DROP CONSTRAINT "FK_b73936acad5e1fdfa5387a0b5fb"`);
        await queryRunner.query(`ALTER TABLE "users_structures_structures" DROP CONSTRAINT "FK_ed6073efac0fa1afca09af609df"`);
        await queryRunner.query(`ALTER TABLE "users_structures_structures" DROP CONSTRAINT "FK_8ed8e56f36ab3fd0cce539e594d"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_368e146b785b574f42ae9e53d5e"`);
        await queryRunner.query(`ALTER TABLE "structures" DROP CONSTRAINT "FK_ef249bc7fc935ae9ff6ec8b7968"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4eb9215469c95530c4842cd572"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b73936acad5e1fdfa5387a0b5f"`);
        await queryRunner.query(`DROP TABLE "structures_closure"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ed6073efac0fa1afca09af609d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8ed8e56f36ab3fd0cce539e594"`);
        await queryRunner.query(`DROP TABLE "users_structures_structures"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "structures"`);
        await queryRunner.query(`DROP TABLE "roles"`);
    }

}
