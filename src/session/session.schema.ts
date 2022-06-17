import { Prop } from "../schema.ts";
import { User } from "../user/user.schema.ts";

export const SESSION_KEY = "session-id";

export class Session {
  @Prop()
  userId?: string;

  @Prop()
  success?: string;

  @Prop()
  error?: string;

  user?: User | null;
}
