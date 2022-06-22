import { Comment } from "../comments/comments.schema.ts";
import { BaseSchema, Prop, Schema } from "deno_mongo_schema";
import { UserInfo } from "../user/user.schema.ts";

@Schema()
export class Post extends BaseSchema {
  @Prop({
    required: true,
  })
  userId: string;

  @Prop({
    required: true,
  })
  title: string;

  @Prop({
    required: true,
  })
  content: string;

  @Prop({
    required: true,
  })
  pv: number;

  createdAt?: string;
  contentHtml?: string;

  author?: UserInfo | null;
  comments?: Comment[] | null;
  commentsCount?: number;
}
