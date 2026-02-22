import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateLineupPlayersTable1708600011000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "lineup_players",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "lineup_id",
            type: "uuid",
          },
          {
            name: "player_id",
            type: "uuid",
          },
          {
            name: "position_slot",
            type: "varchar",
          },
          {
            name: "is_starter",
            type: "boolean",
            default: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      "lineup_players",
      new TableForeignKey({
        columnNames: ["lineup_id"],
        referencedTableName: "lineups",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "lineup_players",
      new TableForeignKey({
        columnNames: ["player_id"],
        referencedTableName: "players",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("lineup_players");

    if (table) {
      for (const fk of table.foreignKeys) {
        await queryRunner.dropForeignKey("lineup_players", fk);
      }
    }

    await queryRunner.dropTable("lineup_players");
  }
}
