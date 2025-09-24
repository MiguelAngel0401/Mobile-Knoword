import { IsNotEmpty, IsString, Length } from 'class-validator';

export class TokenDto {
  @IsNotEmpty()
  @IsString()
  @Length(64, 64)
  token: string;
}
