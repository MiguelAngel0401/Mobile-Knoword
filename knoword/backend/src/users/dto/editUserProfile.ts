import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class EditUserProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  username: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  realName: string;

  @IsOptional()
  avatar: string;

  @IsOptional()
  bio: string;
}
