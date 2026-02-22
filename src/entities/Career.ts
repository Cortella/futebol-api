import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { Team } from "./Team";
import { Season } from "./Season";
import { Division } from "./Division";

export type CareerStatus = "active" | "finished" | "relegated" | "champion";

@Entity("careers")
export class Career {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "user_id", type: "uuid" })
  userId: string;

  @Column({ name: "team_id", type: "uuid" })
  teamId: string;

  @Column({ name: "season_id", type: "uuid" })
  seasonId: string;

  @Column({ name: "division_id", type: "uuid" })
  divisionId: string;

  @Column({ name: "current_round", type: "int", default: 1 })
  currentRound: number;

  @Column({ type: "bigint" })
  budget: string;

  @Column({ type: "int", default: 50 })
  reputation: number;

  @Column({
    type: "enum",
    enum: ["active", "finished", "relegated", "champion"],
    enumName: "career_status",
    default: "active",
  })
  status: CareerStatus;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Team)
  @JoinColumn({ name: "team_id" })
  team: Team;

  @ManyToOne(() => Season)
  @JoinColumn({ name: "season_id" })
  season: Season;

  @ManyToOne(() => Division)
  @JoinColumn({ name: "division_id" })
  division: Division;
}
