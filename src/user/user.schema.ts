import { Prop } from "../schema.ts";

export enum Gender {
  X = "x", // 保密
  Man = "m",
  Female = "f",
}

export class User {
  @Prop({
    unique: true,
  })
  name: string;

  @Prop()
  password: string;

  @Prop({
    required: true,
  })
  avatar: string;

  @Prop()
  gender: Gender;

  @Prop()
  bio: string;
}
