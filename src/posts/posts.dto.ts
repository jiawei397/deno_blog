import { IsOptional, IsString } from "deno_class_validator";

export class CreatePostDto {
  userId: string;

  @IsString()
  title: string;

  @IsString()
  content: string;
}

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;
}
