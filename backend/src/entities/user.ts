import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    ManyToMany,
    JoinTable,
} from 'typeorm'
import { Role } from './role'
import { Structure } from './structure'

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @ManyToOne(() => Role, (role) => role.users)
    @JoinTable()
    role: Role

    @ManyToMany(() => Structure, (structure) => structure.users)
    @JoinTable()
    structures: Structure[]
}
