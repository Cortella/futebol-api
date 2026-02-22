import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("seasons")
export class Season {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "int" })
  year: number;
}
