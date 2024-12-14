import {
    Entity,
    Tree,
    TreeChildren,
    TreeParent,
    ManyToMany,
    PrimaryGeneratedColumn,
    Column,
} from 'typeorm'
import { User } from './user'

@Entity('structures')
@Tree('closure-table')
export class Structure {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string // "South Africa", "Cape Town", "Bellville", etc.

    @TreeParent()
    parent: Structure

    @TreeChildren()
    children: Structure[]

    @ManyToMany(() => User, (user) => user.structures, { cascade: true })
    users: User[]
}
