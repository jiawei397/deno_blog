import { IsString, MaxLength, MinLength } from "deno_class_validator";

export class CreateCommentDto {
  @IsString()
  @MaxLength(1000)
  @MinLength(10)
  content: string;

  @IsString()
  userId: string;

  @IsString()
  postId: string;
}
