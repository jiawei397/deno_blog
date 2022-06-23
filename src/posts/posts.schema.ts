import { Comment } from "../comments/comments.schema.ts";
import {
  BaseSchema,
  Prop,
  Schema,
  SchemaFactory,
  VirtualTypeOptions,
} from "deno_mongo_schema";
import { User, UserInfo } from "../user/user.schema.ts";

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

export const PostSchema = SchemaFactory.createForClass(Post);

const userVirtual: VirtualTypeOptions = {
  ref: User,
  localField: "userId", //本表字段
  foreignField: "_id", //user表中字段
  isTransformLocalFieldToObjectID: true,
  justOne: true,
};
PostSchema.virtual("author", userVirtual);

const commentCountVirtual: VirtualTypeOptions = {
  ref: Comment,
  localField: "_id", //本表字段
  foreignField: "postId", //comment表中字段
  isTransformLocalFieldToString: true,
  count: true,
};
PostSchema.virtual("commentsCount", commentCountVirtual);
