import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Team } from "./Team";

@Entity("players")
export class Player {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 50 })
  position: string;

  @Column({ type: "int" })
  number: number;

  @Column({ length: 50 })
  nationality: string;

  @Column({ type: "date" })
  birthDate: Date;

  @Column({ type: "uuid", nullable: true })
  teamId: string;

  @ManyToOne(() => Team, (team) => team.players, { onDelete: "SET NULL" })
  @JoinColumn({ name: "teamId" })
  team: Team;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
