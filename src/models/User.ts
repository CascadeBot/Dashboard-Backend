import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Unique,
} from 'typeorm';

// TODO add flyway migrations
@Entity()
@Unique('idx:did', ['discordId'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'discord_id' })
  discordId: string;
}
