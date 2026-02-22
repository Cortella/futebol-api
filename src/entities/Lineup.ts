import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Career } from "./Career";

@Entity("lineups")
export class Lineup {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "career_id", type: "uuid" })
  careerId: string;

  @Column({ type: "varchar", nullable: true })
  name: string | null;

  @ManyToOne(() => Career)
  @JoinColumn({ name: "career_id" })
  career: Career;
}
