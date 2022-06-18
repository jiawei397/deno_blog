import { IsString } from "deno_class_validator";

export class CreateCommentDto {
  @IsString()
  content: string;

  userId: string;
  postId: string;
}
