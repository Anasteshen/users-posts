import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Tag } from './tag.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  // TODO: add user relation
  // @ManyToOne(() => User, (user) => user.posts)
  // user: User;

  @Column({ name: 'user_uuid' })
  userUuid: string;

  @ManyToMany(() => Tag, { cascade: ['insert', 'update', 'remove'] })
  @JoinTable({
    name: 'posts_tags',
    joinColumn: { name: 'post_id' },
    inverseJoinColumn: { name: 'tag_id' },
  })
  tags: Tag[];

  @Column({ name: 'file_name', nullable: true })
  fileName: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
