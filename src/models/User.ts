import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Unique,
} from 'typeorm';

@Entity({ name: 'users' })
@Unique('idx_did', ['discordId'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'discord_id' })
  discordId: string;
}
