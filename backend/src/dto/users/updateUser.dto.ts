import { IsString, IsNumber, IsArray, IsNotEmpty } from 'class-validator'

export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsNumber()
    @IsNotEmpty()
    roleId: number

    @IsArray()
    @IsNotEmpty({ each: true })
    structureIds: number[]
}
