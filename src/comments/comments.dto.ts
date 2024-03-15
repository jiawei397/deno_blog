import { IsString, MaxLength, MinLength } from "deno_class_validator";

export class CreateCommentDto {
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  content: string;
}
