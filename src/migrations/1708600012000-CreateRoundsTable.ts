import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateRoundsTable1708600012000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE round_status AS ENUM ('pending', 'simulated')
    `);

    await queryRunner.createTable(
      new Table({
        name: "rounds",
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
            name: "season_id",
            type: "uuid",
          },
          {
            name: "number",
            type: "int",
          },
          {
            name: "status",
            type: "round_status",
            default: "'pending'",
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      "rounds",
      new TableForeignKey({
        columnNames: ["division_id"],
        referencedTableName: "divisions",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "rounds",
      new TableForeignKey({
        columnNames: ["season_id"],
        referencedTableName: "seasons",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("rounds");

    if (table) {
      for (const fk of table.foreignKeys) {
        await queryRunner.dropForeignKey("rounds", fk);
      }
    }

    await queryRunner.dropTable("rounds");
    await queryRunner.query(`DROP TYPE IF EXISTS round_status`);
  }
}
