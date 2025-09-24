import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  realName: string;

  @IsOptional()
  avatar?: string;

  @IsOptional()
  bio?: string;
}
