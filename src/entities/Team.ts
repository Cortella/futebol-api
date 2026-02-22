import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("teams")
export class Team {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar" })
  name: string;

  @Column({ name: "short_name", type: "varchar", length: 3 })
  shortName: string;

  @Column({ type: "varchar" })
  city: string;

  @Column({ type: "varchar", length: 2 })
  state: string;

  @Column({ type: "varchar" })
  stadium: string;

  @Column({ name: "stadium_capacity", type: "int" })
  stadiumCapacity: number;

  @Column({ type: "varchar" })
  colors: string;

  @Column({ type: "varchar", nullable: true })
  logo: string | null;

  @Column({ type: "int" })
  prestige: number;

  @Column({ name: "base_wage", type: "bigint" })
  baseWage: string;
}
