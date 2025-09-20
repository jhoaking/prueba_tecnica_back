import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class user {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  firstName: string;

  @Column('text')
  lastName: string;

  @Column('text', {
    unique: true,
  })
  email1: string;

  @Column('text', {
    unique: true,
  })
  email2: string;

  @Column('text')
  profession: string;
}
