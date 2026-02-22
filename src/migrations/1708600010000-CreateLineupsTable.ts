import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateLineupsTable1708600010000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "lineups",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "career_id",
            type: "uuid",
          },
          {
            name: "name",
            type: "varchar",
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      "lineups",
      new TableForeignKey({
        columnNames: ["career_id"],
        referencedTableName: "careers",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("lineups");

    if (table) {
      for (const fk of table.foreignKeys) {
        await queryRunner.dropForeignKey("lineups", fk);
      }
    }

    await queryRunner.dropTable("lineups");
  }
}
