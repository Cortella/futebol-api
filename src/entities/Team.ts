import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Player } from "./Player";

@Entity("teams")
export class Team {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100 })
  city: string;

  @Column({ length: 100 })
  stadium: string;

  @Column({ type: "int" })
  foundedYear: number;

  @Column({ length: 500, nullable: true })
  logoUrl: string;

  @OneToMany(() => Player, (player) => player.team)
  players: Player[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
