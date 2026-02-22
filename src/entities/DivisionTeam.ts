import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Division } from "./Division";
import { Team } from "./Team";

@Entity("division_teams")
export class DivisionTeam {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "division_id", type: "uuid" })
  divisionId: string;

  @Column({ name: "team_id", type: "uuid" })
  teamId: string;

  @Column({ name: "is_user_team", type: "boolean", default: false })
  isUserTeam: boolean;

  @ManyToOne(() => Division)
  @JoinColumn({ name: "division_id" })
  division: Division;

  @ManyToOne(() => Team)
  @JoinColumn({ name: "team_id" })
  team: Team;
}
