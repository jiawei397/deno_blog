import { IsNumber, IsOptional, IsString, Min } from "deno_class_validator";

export class CreateUserDto {
  @IsString()
  author: string;

  @IsNumber()
  @Min(0)
  age: number;
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
