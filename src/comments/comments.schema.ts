import { UserInfo } from "../user/user.schema.ts";
import { BaseSchema, Prop, Schema } from "deno_mongo_schema";

@Schema()
export class Comment extends BaseSchema {
  @Prop()
  userId: string;

  @Prop({
    required: true,
  })
  content: string;

  @Prop({
    required: true,
  })
  postId: string;

  createdAt?: string;
  contentHtml?: string;

  author?: UserInfo | null;
}
