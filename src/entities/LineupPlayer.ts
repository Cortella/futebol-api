import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Lineup } from "./Lineup";
import { Player } from "./Player";

@Entity("lineup_players")
export class LineupPlayer {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "lineup_id", type: "uuid" })
  lineupId: string;

  @Column({ name: "player_id", type: "uuid" })
  playerId: string;

  @Column({ name: "position_slot", type: "varchar" })
  positionSlot: string;

  @Column({ name: "is_starter", type: "boolean", default: true })
  isStarter: boolean;

  @ManyToOne(() => Lineup)
  @JoinColumn({ name: "lineup_id" })
  lineup: Lineup;

  @ManyToOne(() => Player)
  @JoinColumn({ name: "player_id" })
  player: Player;
}
