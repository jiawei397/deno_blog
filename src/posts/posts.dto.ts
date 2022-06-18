import { IsOptional, IsString, MaxLength } from "deno_class_validator";

export class CreatePostDto {
  userId: string;

  @IsString()
  @MaxLength(100)
  title: string;

  @IsString()
  @MaxLength(1000)
  content: string;
}

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  content?: string;
}
