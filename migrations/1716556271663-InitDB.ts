import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDB1716556271663 implements MigrationInterface {
  name = 'InitDB1716556271663';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" (
        "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), 
        "email" VARCHAR(255) NOT NULL, 
        CONSTRAINT "PK_USER_UUID" PRIMARY KEY ("uuid")
    )`,
    );

    await queryRunner.query(
      `CREATE TABLE tags (
        "id" SERIAL NOT NULL,
        "name" character varying(255) NOT NULL, 
        CONSTRAINT "PK_TAGS_ID" PRIMARY KEY ("id")
        )`,
    );

    await queryRunner.query(`CREATE INDEX "IDX_TAG_NAME" ON tags("name") `);
    await queryRunner.query(
      `CREATE TABLE posts (
        "id" SERIAL NOT NULL, 
        "title" VARCHAR(255) NOT NULL, 
        "description" VARCHAR(255) NOT NULL,
        "user_uuid" UUID NOT NULL REFERENCES users(uuid), 
        "file_name" VARCHAR(255), 
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
        "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
        CONSTRAINT "PK_POST_ID" PRIMARY KEY ("id")
        )`,
    );
    await queryRunner.query(
      `CREATE TABLE posts_tags (
        post_id INT NOT NULL,
        tag_id INT NOT NULL,
        PRIMARY KEY (post_id, tag_id),
        FOREIGN KEY (post_id) REFERENCES posts(id),
        FOREIGN KEY (tag_id) REFERENCES tags(id)
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "posts_tags"`);
    await queryRunner.query(`DROP TABLE "posts"`);
    await queryRunner.query(`DROP INDEX "IDX_TAG_NAME"`);
    await queryRunner.query(`DROP TABLE "tags"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
