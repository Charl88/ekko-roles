import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { User } from './user'

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string // "Manager" or "Employee", etc.

    @OneToMany(() => User, (user) => user.role)
    users: User[]
}
