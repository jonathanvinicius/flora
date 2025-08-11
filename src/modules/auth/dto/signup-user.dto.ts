import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignUpUserDto {
  @IsString()
  @ApiProperty({ description: 'Name', example: 'johndoe@gmail.com' })
  name: string;

  @IsString()
  @ApiProperty({ description: 'Email', example: 'johndoe@gmail.com' })
  email: string;

  @IsString()
  @ApiProperty({
    description: 'Password',
    example: '123@',
  })
  password: string;
}
