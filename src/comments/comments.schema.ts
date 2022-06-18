import { Prop } from "../schema.ts";
import { UserInfo } from "../user/user.schema.ts";

export class Comment {
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

  @Prop()
  createTime: Date;

  @Prop()
  updateTime: Date;

  createdAt?: string;
  contentHtml?: string;

  author?: UserInfo | null;
}
