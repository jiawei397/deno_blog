import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from "deno_class_validator";
import { Gender } from "./user.schema.ts";

export class CreateUserDto {
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  name: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  repassword: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  @MinLength(1)
  @MaxLength(30)
  bio: string;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  author?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  age?: number;
}
