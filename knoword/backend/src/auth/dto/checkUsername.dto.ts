import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CheckUsernameDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  username: string;
}
