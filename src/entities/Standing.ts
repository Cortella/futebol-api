import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Division } from "./Division";
import { Team } from "./Team";

@Entity("standings")
export class Standing {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "division_id", type: "uuid" })
  divisionId: string;

  @Column({ name: "team_id", type: "uuid" })
  teamId: string;

  @Column({ type: "int", default: 0 })
  position: number;

  @Column({ type: "int", default: 0 })
  points: number;

  @Column({ type: "int", default: 0 })
  played: number;

  @Column({ type: "int", default: 0 })
  wins: number;

  @Column({ type: "int", default: 0 })
  draws: number;

  @Column({ type: "int", default: 0 })
  losses: number;

  @Column({ name: "goals_for", type: "int", default: 0 })
  goalsFor: number;

  @Column({ name: "goals_against", type: "int", default: 0 })
  goalsAgainst: number;

  @Column({ name: "goal_difference", type: "int", default: 0 })
  goalDifference: number;

  @Column({ type: "varchar", default: "" })
  form: string;

  @Column({ type: "varchar", default: "" })
  streak: string;

  @ManyToOne(() => Division)
  @JoinColumn({ name: "division_id" })
  division: Division;

  @ManyToOne(() => Team)
  @JoinColumn({ name: "team_id" })
  team: Team;
}
