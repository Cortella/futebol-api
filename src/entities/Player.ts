import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Team } from "./Team";

export type PlayerPosition =
  | "GOL"
  | "ZAG"
  | "LD"
  | "LE"
  | "VOL"
  | "MC"
  | "MEI"
  | "PD"
  | "PE"
  | "ATA"
  | "SA";

@Entity("players")
export class Player {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "varchar", nullable: true })
  nickname: string | null;

  @Column({ name: "team_id", type: "uuid", nullable: true })
  teamId: string | null;

  @Column({
    type: "enum",
    enum: ["GOL", "ZAG", "LD", "LE", "VOL", "MC", "MEI", "PD", "PE", "ATA", "SA"],
    enumName: "player_position",
  })
  position: PlayerPosition;

  @Column({ type: "int" })
  age: number;

  @Column({ type: "varchar" })
  nationality: string;

  @Column({ name: "shirt_number", type: "int", nullable: true })
  shirtNumber: number | null;

  @Column({ type: "int" })
  force: number;

  @Column({ type: "int" })
  velocity: number;

  @Column({ type: "int" })
  stamina: number;

  @Column({ type: "int" })
  technique: number;

  @Column({ type: "int", default: 50 })
  morale: number;

  @Column({ type: "int", default: 100 })
  condition: number;

  @Column({ type: "int", default: 0 })
  injury: number;

  @Column({ type: "bigint" })
  salary: string;

  @Column({ name: "market_value", type: "bigint" })
  marketValue: string;

  @Column({ name: "for_sale", type: "boolean", default: false })
  forSale: boolean;

  @Column({ name: "asking_price", type: "bigint", nullable: true })
  askingPrice: string | null;

  @Column({ type: "boolean", default: false })
  suspended: boolean;

  @Column({ name: "yellow_cards", type: "int", default: 0 })
  yellowCards: number;

  @Column({ name: "red_cards", type: "int", default: 0 })
  redCards: number;

  @ManyToOne(() => Team)
  @JoinColumn({ name: "team_id" })
  team: Team;
}
