import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateCareersTable1708600008000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE career_status AS ENUM ('active', 'finished', 'relegated', 'champion')
    `);

    await queryRunner.createTable(
      new Table({
        name: "careers",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "user_id",
            type: "uuid",
          },
          {
            name: "team_id",
            type: "uuid",
          },
          {
            name: "season_id",
            type: "uuid",
          },
          {
            name: "division_id",
            type: "uuid",
          },
          {
            name: "current_round",
            type: "int",
            default: 1,
          },
          {
            name: "budget",
            type: "bigint",
          },
          {
            name: "reputation",
            type: "int",
            default: 50,
          },
          {
            name: "status",
            type: "career_status",
            default: "'active'",
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      "careers",
      new TableForeignKey({
        columnNames: ["user_id"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "careers",
      new TableForeignKey({
        columnNames: ["team_id"],
        referencedTableName: "teams",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "careers",
      new TableForeignKey({
        columnNames: ["season_id"],
        referencedTableName: "seasons",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "careers",
      new TableForeignKey({
        columnNames: ["division_id"],
        referencedTableName: "divisions",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("careers");

    if (table) {
      for (const fk of table.foreignKeys) {
        await queryRunner.dropForeignKey("careers", fk);
      }
    }

    await queryRunner.dropTable("careers");
    await queryRunner.query(`DROP TYPE IF EXISTS career_status`);
  }
}
