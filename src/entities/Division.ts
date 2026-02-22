import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Championship } from "./Championship";
import { Season } from "./Season";

export type DivisionStatus = "not_started" | "in_progress" | "finished";

@Entity("divisions")
export class Division {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "championship_id", type: "uuid" })
  championshipId: string;

  @Column({ name: "season_id", type: "uuid" })
  seasonId: string;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "int" })
  level: number;

  @Column({ name: "total_teams", type: "int" })
  totalTeams: number;

  @Column({ name: "promotion_slots", type: "int" })
  promotionSlots: number;

  @Column({ name: "relegation_slots", type: "int" })
  relegationSlots: number;

  @Column({ name: "total_rounds", type: "int" })
  totalRounds: number;

  @Column({
    type: "enum",
    enum: ["not_started", "in_progress", "finished"],
    enumName: "division_status",
    default: "not_started",
  })
  status: DivisionStatus;

  @ManyToOne(() => Championship)
  @JoinColumn({ name: "championship_id" })
  championship: Championship;

  @ManyToOne(() => Season)
  @JoinColumn({ name: "season_id" })
  season: Season;
}
