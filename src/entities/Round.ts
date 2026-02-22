import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Division } from "./Division";
import { Season } from "./Season";

export type RoundStatus = "pending" | "simulated";

@Entity("rounds")
export class Round {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "division_id", type: "uuid" })
  divisionId: string;

  @Column({ name: "season_id", type: "uuid" })
  seasonId: string;

  @Column({ type: "int" })
  number: number;

  @Column({
    type: "enum",
    enum: ["pending", "simulated"],
    enumName: "round_status",
    default: "pending",
  })
  status: RoundStatus;

  @ManyToOne(() => Division)
  @JoinColumn({ name: "division_id" })
  division: Division;

  @ManyToOne(() => Season)
  @JoinColumn({ name: "season_id" })
  season: Season;
}
