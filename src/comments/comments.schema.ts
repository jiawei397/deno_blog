import { User, UserInfo } from "../user/user.schema.ts";
import {
  BaseSchema,
  Prop,
  Schema,
  SchemaFactory,
  VirtualTypeOptions,
} from "deno_mongo_schema";

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

export const CommentSchema = SchemaFactory.createForClass(Comment);

const userVirtual: VirtualTypeOptions = {
  ref: User,
  localField: "userId", //本表字段
  foreignField: "_id", //user表中字段
  isTransformLocalFieldToObjectID: true,
  justOne: true,
};
CommentSchema.virtual("author", userVirtual);
