import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateDivisionsTable1708600005000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE division_status AS ENUM ('not_started', 'in_progress', 'finished')
    `);

    await queryRunner.createTable(
      new Table({
        name: "divisions",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "championship_id",
            type: "uuid",
          },
          {
            name: "season_id",
            type: "uuid",
          },
          {
            name: "name",
            type: "varchar",
          },
          {
            name: "level",
            type: "int",
          },
          {
            name: "total_teams",
            type: "int",
          },
          {
            name: "promotion_slots",
            type: "int",
          },
          {
            name: "relegation_slots",
            type: "int",
          },
          {
            name: "total_rounds",
            type: "int",
          },
          {
            name: "status",
            type: "division_status",
            default: "'not_started'",
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      "divisions",
      new TableForeignKey({
        columnNames: ["championship_id"],
        referencedTableName: "championships",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "divisions",
      new TableForeignKey({
        columnNames: ["season_id"],
        referencedTableName: "seasons",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("divisions");

    if (table) {
      for (const fk of table.foreignKeys) {
        await queryRunner.dropForeignKey("divisions", fk);
      }
    }

    await queryRunner.dropTable("divisions");
    await queryRunner.query(`DROP TYPE IF EXISTS division_status`);
  }
}
