import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTeamsTable1708600004000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "teams",
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
            name: "short_name",
            type: "varchar",
            length: "3",
          },
          {
            name: "city",
            type: "varchar",
          },
          {
            name: "state",
            type: "varchar",
            length: "2",
          },
          {
            name: "stadium",
            type: "varchar",
          },
          {
            name: "stadium_capacity",
            type: "int",
          },
          {
            name: "colors",
            type: "varchar",
          },
          {
            name: "logo",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "prestige",
            type: "int",
          },
          {
            name: "base_wage",
            type: "bigint",
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("teams");
  }
}
