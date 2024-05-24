import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthCredentialsDto {
  @ApiProperty({ example: 'john@example.com', description: 'Email address' })
  @IsEmail()
  @IsString()
  email: string;

  // TODO: add password validation rules
  @ApiProperty({ example: 'password123', description: 'Password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
