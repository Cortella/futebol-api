import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Career } from "./Career";

export type TacticStyle =
  | "ultra_defensive"
  | "defensive"
  | "moderate"
  | "offensive"
  | "ultra_offensive";
export type TacticMarking = "zone" | "man_to_man";
export type TacticTempo = "slow" | "normal" | "fast";
export type TacticPassing = "short" | "mixed" | "long";
export type TacticPressure = "low" | "normal" | "high";

@Entity("tactics")
export class Tactic {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "career_id", type: "uuid" })
  careerId: string;

  @Column({ type: "varchar", default: "4-4-2" })
  formation: string;

  @Column({
    type: "enum",
    enum: ["ultra_defensive", "defensive", "moderate", "offensive", "ultra_offensive"],
    enumName: "tactic_style",
    default: "moderate",
  })
  style: TacticStyle;

  @Column({
    type: "enum",
    enum: ["zone", "man_to_man"],
    enumName: "tactic_marking",
    default: "zone",
  })
  marking: TacticMarking;

  @Column({
    type: "enum",
    enum: ["slow", "normal", "fast"],
    enumName: "tactic_tempo",
    default: "normal",
  })
  tempo: TacticTempo;

  @Column({
    type: "enum",
    enum: ["short", "mixed", "long"],
    enumName: "tactic_passing",
    default: "mixed",
  })
  passing: TacticPassing;

  @Column({
    type: "enum",
    enum: ["low", "normal", "high"],
    enumName: "tactic_pressure",
    default: "normal",
  })
  pressure: TacticPressure;

  @ManyToOne(() => Career)
  @JoinColumn({ name: "career_id" })
  career: Career;
}
