import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateMatchesTable1708600013000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "matches",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "round_id",
            type: "uuid",
          },
          {
            name: "division_id",
            type: "uuid",
          },
          {
            name: "home_team_id",
            type: "uuid",
          },
          {
            name: "away_team_id",
            type: "uuid",
          },
          {
            name: "home_goals",
            type: "int",
            isNullable: true,
          },
          {
            name: "away_goals",
            type: "int",
            isNullable: true,
          },
          {
            name: "attendance",
            type: "int",
            isNullable: true,
          },
          {
            name: "played",
            type: "boolean",
            default: false,
          },
          {
            name: "events",
            type: "jsonb",
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      "matches",
      new TableForeignKey({
        columnNames: ["round_id"],
        referencedTableName: "rounds",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "matches",
      new TableForeignKey({
        columnNames: ["division_id"],
        referencedTableName: "divisions",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "matches",
      new TableForeignKey({
        columnNames: ["home_team_id"],
        referencedTableName: "teams",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "matches",
      new TableForeignKey({
        columnNames: ["away_team_id"],
        referencedTableName: "teams",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("matches");

    if (table) {
      for (const fk of table.foreignKeys) {
        await queryRunner.dropForeignKey("matches", fk);
      }
    }

    await queryRunner.dropTable("matches");
  }
}
