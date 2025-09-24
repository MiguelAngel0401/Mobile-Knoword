import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateCommunityDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  banner?: string;

  @IsBoolean()
  @IsNotEmpty()
  isPrivate: boolean;

  @ArrayNotEmpty()
  @ArrayMinSize(3)
  @IsString({ each: true })
  @MinLength(3, { each: true })
  tags: string[];
}
