import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsArray,
} from 'class-validator';

export class UpdateCommunityDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  banner?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
