import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTransfersTable1708600015000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE transfer_type AS ENUM ('buy', 'sell', 'free', 'loan')
    `);

    await queryRunner.createTable(
      new Table({
        name: "transfers",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "player_id",
            type: "uuid",
          },
          {
            name: "from_team_id",
            type: "uuid",
            isNullable: true,
          },
          {
            name: "to_team_id",
            type: "uuid",
          },
          {
            name: "season_id",
            type: "uuid",
          },
          {
            name: "price",
            type: "bigint",
          },
          {
            name: "type",
            type: "transfer_type",
          },
          {
            name: "date",
            type: "timestamp",
            default: "now()",
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      "transfers",
      new TableForeignKey({
        columnNames: ["player_id"],
        referencedTableName: "players",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "transfers",
      new TableForeignKey({
        columnNames: ["from_team_id"],
        referencedTableName: "teams",
        referencedColumnNames: ["id"],
        onDelete: "SET NULL",
      }),
    );

    await queryRunner.createForeignKey(
      "transfers",
      new TableForeignKey({
        columnNames: ["to_team_id"],
        referencedTableName: "teams",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "transfers",
      new TableForeignKey({
        columnNames: ["season_id"],
        referencedTableName: "seasons",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("transfers");

    if (table) {
      for (const fk of table.foreignKeys) {
        await queryRunner.dropForeignKey("transfers", fk);
      }
    }

    await queryRunner.dropTable("transfers");
    await queryRunner.query(`DROP TYPE IF EXISTS transfer_type`);
  }
}
