import { Prop } from "../schema.ts";
import { UserInfo } from "../user/user.schema.ts";

export class Post {
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

  author?: UserInfo | null;
}
