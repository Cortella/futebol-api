import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreatePlayersTable1708600007000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE player_position AS ENUM (
        'GOL', 'ZAG', 'LD', 'LE', 'VOL', 'MC', 'MEI', 'PD', 'PE', 'ATA', 'SA'
      )
    `);

    await queryRunner.createTable(
      new Table({
        name: "players",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "name",
            type: "varchar",
          },
          {
            name: "nickname",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "team_id",
            type: "uuid",
            isNullable: true,
          },
          {
            name: "position",
            type: "player_position",
          },
          {
            name: "age",
            type: "int",
          },
          {
            name: "nationality",
            type: "varchar",
          },
          {
            name: "shirt_number",
            type: "int",
            isNullable: true,
          },
          {
            name: "force",
            type: "int",
          },
          {
            name: "velocity",
            type: "int",
          },
          {
            name: "stamina",
            type: "int",
          },
          {
            name: "technique",
            type: "int",
          },
          {
            name: "morale",
            type: "int",
            default: 50,
          },
          {
            name: "condition",
            type: "int",
            default: 100,
          },
          {
            name: "injury",
            type: "int",
            default: 0,
          },
          {
            name: "salary",
            type: "bigint",
          },
          {
            name: "market_value",
            type: "bigint",
          },
          {
            name: "for_sale",
            type: "boolean",
            default: false,
          },
          {
            name: "asking_price",
            type: "bigint",
            isNullable: true,
          },
          {
            name: "suspended",
            type: "boolean",
            default: false,
          },
          {
            name: "yellow_cards",
            type: "int",
            default: 0,
          },
          {
            name: "red_cards",
            type: "int",
            default: 0,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      "players",
      new TableForeignKey({
        columnNames: ["team_id"],
        referencedTableName: "teams",
        referencedColumnNames: ["id"],
        onDelete: "SET NULL",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("players");

    if (table) {
      for (const fk of table.foreignKeys) {
        await queryRunner.dropForeignKey("players", fk);
      }
    }

    await queryRunner.dropTable("players");
    await queryRunner.query(`DROP TYPE IF EXISTS player_position`);
  }
}
