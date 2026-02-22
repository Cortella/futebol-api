import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateDivisionTeamsTable1708600006000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "division_teams",
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
            name: "is_user_team",
            type: "boolean",
            default: false,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      "division_teams",
      new TableForeignKey({
        columnNames: ["division_id"],
        referencedTableName: "divisions",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "division_teams",
      new TableForeignKey({
        columnNames: ["team_id"],
        referencedTableName: "teams",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("division_teams");

    if (table) {
      for (const fk of table.foreignKeys) {
        await queryRunner.dropForeignKey("division_teams", fk);
      }
    }

    await queryRunner.dropTable("division_teams");
  }
}
