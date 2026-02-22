import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("championships")
export class Championship {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "varchar" })
  country: string;

  @Column({ type: "varchar", nullable: true })
  logo: string | null;
}
