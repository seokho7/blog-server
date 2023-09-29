import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'USER' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column()
  USER_EMAIL: string;

  @Column({ nullable: true })
  USER_PW: string;

  @Column({ nullable: true })
  USER_PHONE: string;

  @Column({ nullable: true })
  USER_NICKNAME: string;

  @Column()
  USER_NAME: string;

  @CreateDateColumn()
  USER_CREATE_DTM: string;

  @Column({ nullable: true, default: 'normal' })
  PROVIDER_ID: string;
}
