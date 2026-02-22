import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Round } from "./Round";
import { Division } from "./Division";
import { Team } from "./Team";

export interface MatchEvent {
  minute: number;
  type: "goal" | "own_goal" | "yellow_card" | "red_card" | "substitution" | "injury";
  playerId: string;
  teamId: string;
  assistId?: string;
  detail?: string;
}

@Entity("matches")
export class Match {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "round_id", type: "uuid" })
  roundId: string;

  @Column({ name: "division_id", type: "uuid" })
  divisionId: string;

  @Column({ name: "home_team_id", type: "uuid" })
  homeTeamId: string;

  @Column({ name: "away_team_id", type: "uuid" })
  awayTeamId: string;

  @Column({ name: "home_goals", type: "int", nullable: true })
  homeGoals: number | null;

  @Column({ name: "away_goals", type: "int", nullable: true })
  awayGoals: number | null;

  @Column({ type: "int", nullable: true })
  attendance: number | null;

  @Column({ type: "boolean", default: false })
  played: boolean;

  @Column({ type: "jsonb", nullable: true })
  events: MatchEvent[] | null;

  @ManyToOne(() => Round)
  @JoinColumn({ name: "round_id" })
  round: Round;

  @ManyToOne(() => Division)
  @JoinColumn({ name: "division_id" })
  division: Division;

  @ManyToOne(() => Team)
  @JoinColumn({ name: "home_team_id" })
  homeTeam: Team;

  @ManyToOne(() => Team)
  @JoinColumn({ name: "away_team_id" })
  awayTeam: Team;
}
