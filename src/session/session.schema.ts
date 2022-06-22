import { BaseSchema, Prop, Schema } from "deno_mongo_schema";
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
    expires: 60 * 60 * 24 * 7,
    default: Date.now,
  })
  expired?: Date;

  user?: User | null;
}
