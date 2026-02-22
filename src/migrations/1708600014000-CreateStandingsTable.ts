import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateStandingsTable1708600014000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "standings",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "division_id",
            type: "uuid",
          },
          {
            name: "team_id",
            type: "uuid",
          },
          {
            name: "position",
            type: "int",
            default: 0,
          },
          {
            name: "points",
            type: "int",
            default: 0,
          },
          {
            name: "played",
            type: "int",
            default: 0,
          },
          {
            name: "wins",
            type: "int",
            default: 0,
          },
          {
            name: "draws",
            type: "int",
            default: 0,
          },
          {
            name: "losses",
            type: "int",
            default: 0,
          },
          {
            name: "goals_for",
            type: "int",
            default: 0,
          },
          {
            name: "goals_against",
            type: "int",
            default: 0,
          },
          {
            name: "goal_difference",
            type: "int",
            default: 0,
          },
          {
            name: "form",
            type: "varchar",
            default: "''",
          },
          {
            name: "streak",
            type: "varchar",
            default: "''",
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      "standings",
      new TableForeignKey({
        columnNames: ["division_id"],
        referencedTableName: "divisions",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "standings",
      new TableForeignKey({
        columnNames: ["team_id"],
        referencedTableName: "teams",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("standings");

    if (table) {
      for (const fk of table.foreignKeys) {
        await queryRunner.dropForeignKey("standings", fk);
      }
    }

    await queryRunner.dropTable("standings");
  }
}
