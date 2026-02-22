import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Player } from "./Player";
import { Team } from "./Team";
import { Season } from "./Season";

export type TransferType = "buy" | "sell" | "free" | "loan";

@Entity("transfers")
export class Transfer {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "player_id", type: "uuid" })
  playerId: string;

  @Column({ name: "from_team_id", type: "uuid", nullable: true })
  fromTeamId: string | null;

  @Column({ name: "to_team_id", type: "uuid" })
  toTeamId: string;

  @Column({ name: "season_id", type: "uuid" })
  seasonId: string;

  @Column({ type: "bigint" })
  price: string;

  @Column({
    type: "enum",
    enum: ["buy", "sell", "free", "loan"],
    enumName: "transfer_type",
  })
  type: TransferType;

  @CreateDateColumn()
  date: Date;

  @ManyToOne(() => Player)
  @JoinColumn({ name: "player_id" })
  player: Player;

  @ManyToOne(() => Team)
  @JoinColumn({ name: "from_team_id" })
  fromTeam: Team;

  @ManyToOne(() => Team)
  @JoinColumn({ name: "to_team_id" })
  toTeam: Team;

  @ManyToOne(() => Season)
  @JoinColumn({ name: "season_id" })
  season: Season;
}
