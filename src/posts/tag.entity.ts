import { PrimaryGeneratedColumn, Column, Index, Entity } from 'typeorm';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  name: string;
}
