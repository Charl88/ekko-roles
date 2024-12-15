import { MigrationInterface, QueryRunner } from 'typeorm'
import { Role } from '../entities/role'
import { User } from '../entities/user'
import { Structure } from '../entities/structure'

export class Seed1734188066151 implements MigrationInterface {
    name = 'Seed1734188066151'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create Roles
        const manager = await queryRunner.manager.save(
            queryRunner.manager.create(Role, { name: 'Manager' })
        )
        const employee = await queryRunner.manager.save(
            queryRunner.manager.create(Role, { name: 'Employee' })
        )

        // Create structures and users
        const country = await queryRunner.manager.save(
            queryRunner.manager.create(Structure, { name: 'South Africa' })
        )

        await queryRunner.manager.save(
            queryRunner.manager.create(User, {
                name: 'Alice',
                role: manager,
                structures: [country],
            })
        )

        const city = await queryRunner.manager.save(
            queryRunner.manager.create(Structure, {
                name: 'Cape Town',
                parent: country,
            })
        )

        await queryRunner.manager.save(
            queryRunner.manager.create(User, {
                name: 'Bob',
                role: manager,
                structures: [city],
            })
        )

        await queryRunner.manager.save(
            queryRunner.manager.create(User, {
                name: 'Kabelo',
                role: manager,
                structures: [city],
            })
        )

        const suburb1 = await queryRunner.manager.save(
            queryRunner.manager.create(Structure, {
                name: 'Tamboerskloof',
                parent: city,
            })
        )

        await queryRunner.manager.save(
            queryRunner.manager.create(User, {
                name: 'Charl',
                role: manager,
                structures: [suburb1],
            })
        )

        const suburb2 = await queryRunner.manager.save(
            queryRunner.manager.create(Structure, {
                name: 'Sea Point',
                parent: city,
            })
        )

        await queryRunner.manager.save(
            queryRunner.manager.create(User, {
                name: 'Paula',
                role: manager,
                structures: [suburb2],
            })
        )

        const city2 = await queryRunner.manager.save(
            queryRunner.manager.create(Structure, {
                name: 'Johannesburg',
                parent: country,
            })
        )

        await queryRunner.manager.save(
            queryRunner.manager.create(User, {
                name: 'Lerato',
                role: manager,
                structures: [city2],
            })
        )

        await queryRunner.manager.save(
            queryRunner.manager.create(User, {
                name: 'Zahir',
                role: employee,
                structures: [city2],
            })
        )

        const suburb3 = await queryRunner.manager.save(
            queryRunner.manager.create(Structure, {
                name: 'Sandton',
                parent: city2,
            })
        )

        await queryRunner.manager.save(
            queryRunner.manager.create(User, {
                name: 'Cecilia',
                role: manager,
                structures: [suburb3],
            })
        )

        const suburb4 = await queryRunner.manager.save(
            queryRunner.manager.create(Structure, {
                name: 'Fourways',
                parent: city2,
            })
        )

        await queryRunner.manager.save(
            queryRunner.manager.create(User, {
                name: 'John',
                role: manager,
                structures: [suburb4],
            })
        )

        const country2 = await queryRunner.manager.save(
            queryRunner.manager.create(Structure, { name: 'United Kingdom' })
        )

        await queryRunner.manager.save(
            queryRunner.manager.create(User, {
                name: 'David',
                role: manager,
                structures: [country2],
            })
        )

        const city3 = await queryRunner.manager.save(
            queryRunner.manager.create(Structure, {
                name: 'London',
                parent: country2,
            })
        )

        await queryRunner.manager.save(
            queryRunner.manager.create(User, {
                name: 'Sadiq',
                role: manager,
                structures: [city3],
            })
        )

        const suburb5 = await queryRunner.manager.save(
            queryRunner.manager.create(Structure, {
                name: 'Camden',
                parent: city3,
            })
        )

        await queryRunner.manager.save(
            queryRunner.manager.create(User, {
                name: 'Boris',
                role: manager,
                structures: [suburb5],
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Delete users
        await queryRunner.manager.delete(User, { name: 'Alice' })
        await queryRunner.manager.delete(User, { name: 'Bob' })
        await queryRunner.manager.delete(User, { name: 'Kabelo' })
        await queryRunner.manager.delete(User, { name: 'Charl' })
        await queryRunner.manager.delete(User, { name: 'Paula' })
        await queryRunner.manager.delete(User, { name: 'Lerato' })
        await queryRunner.manager.delete(User, { name: 'Cecilia' })
        await queryRunner.manager.delete(User, { name: 'John' })
        await queryRunner.manager.delete(User, { name: 'David' })
        await queryRunner.manager.delete(User, { name: 'Sadiq' })
        await queryRunner.manager.delete(User, { name: 'Boris' })

        // Delete structures
        await queryRunner.manager.delete(Structure, { name: 'Camden' })
        await queryRunner.manager.delete(Structure, { name: 'London' })
        await queryRunner.manager.delete(Structure, { name: 'United Kingdom' })
        await queryRunner.manager.delete(Structure, { name: 'Fourways' })
        await queryRunner.manager.delete(Structure, { name: 'Sandton' })
        await queryRunner.manager.delete(Structure, { name: 'Johannesburg' })
        await queryRunner.manager.delete(Structure, { name: 'Sea Point' })
        await queryRunner.manager.delete(Structure, { name: 'Tamboerskloof' })
        await queryRunner.manager.delete(Structure, { name: 'Cape Town' })
        await queryRunner.manager.delete(Structure, { name: 'South Africa' })

        // Delete roles
        await queryRunner.manager.delete(Role, { name: 'Manager' })
        await queryRunner.manager.delete(Role, { name: 'Employee' })
    }
}
