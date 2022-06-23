import {
  BaseSchema,
  Prop,
  Schema,
  SchemaFactory,
  VirtualTypeOptions,
} from "deno_mongo_schema";
import { User } from "../user/user.schema.ts";

export const SESSION_KEY = "session-id";

@Schema()
export class Session extends BaseSchema {
  @Prop()
  userId?: string;

  @Prop()
  success?: string;

  @Prop()
  error?: string;

  @Prop({
    index: true,
    expires: 60 * 60 * 24 * 7,
    default: Date.now,
  })
  expired?: Date;

  user?: User | null;
}

export const SessionSchema = SchemaFactory.createForClass(Session);

const userVirtual: VirtualTypeOptions = {
  ref: User,
  localField: "userId", //本表字段
  foreignField: "_id", //user表中字段
  isTransformLocalFieldToObjectID: true,
  justOne: true,
};
SessionSchema.virtual("user", userVirtual);
