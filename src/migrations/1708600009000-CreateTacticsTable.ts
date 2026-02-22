import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTacticsTable1708600009000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE tactic_style AS ENUM (
        'ultra_defensive', 'defensive', 'moderate', 'offensive', 'ultra_offensive'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE tactic_marking AS ENUM ('zone', 'man_to_man')
    `);

    await queryRunner.query(`
      CREATE TYPE tactic_tempo AS ENUM ('slow', 'normal', 'fast')
    `);

    await queryRunner.query(`
      CREATE TYPE tactic_passing AS ENUM ('short', 'mixed', 'long')
    `);

    await queryRunner.query(`
      CREATE TYPE tactic_pressure AS ENUM ('low', 'normal', 'high')
    `);

    await queryRunner.createTable(
      new Table({
        name: "tactics",
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
            name: "formation",
            type: "varchar",
            default: "'4-4-2'",
          },
          {
            name: "style",
            type: "tactic_style",
            default: "'moderate'",
          },
          {
            name: "marking",
            type: "tactic_marking",
            default: "'zone'",
          },
          {
            name: "tempo",
            type: "tactic_tempo",
            default: "'normal'",
          },
          {
            name: "passing",
            type: "tactic_passing",
            default: "'mixed'",
          },
          {
            name: "pressure",
            type: "tactic_pressure",
            default: "'normal'",
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      "tactics",
      new TableForeignKey({
        columnNames: ["career_id"],
        referencedTableName: "careers",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("tactics");

    if (table) {
      for (const fk of table.foreignKeys) {
        await queryRunner.dropForeignKey("tactics", fk);
      }
    }

    await queryRunner.dropTable("tactics");
    await queryRunner.query(`DROP TYPE IF EXISTS tactic_pressure`);
    await queryRunner.query(`DROP TYPE IF EXISTS tactic_passing`);
    await queryRunner.query(`DROP TYPE IF EXISTS tactic_tempo`);
    await queryRunner.query(`DROP TYPE IF EXISTS tactic_marking`);
    await queryRunner.query(`DROP TYPE IF EXISTS tactic_style`);
  }
}
