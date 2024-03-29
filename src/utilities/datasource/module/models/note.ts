import { PrimaryGeneratedColumn, Entity, Column, ManyToOne } from "typeorm";
import { User } from "./user";

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  title!: string;

  @Column("text")
  content!: string;

  @ManyToOne(() => User, (user) => user.notes)
  user!: User;
}
