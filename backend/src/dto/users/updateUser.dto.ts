import { IsString, IsNumber, IsArray, IsNotEmpty, IsIn } from 'class-validator'

export class UpdateUserDto {
    @IsString()
    name: string

    @IsNumber()
    roleId: number

    @IsArray()
    @IsNotEmpty({ each: true })
    structureIds: number[]
}
