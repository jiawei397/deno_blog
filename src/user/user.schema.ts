import { BaseSchema, Prop, Schema } from "deno_mongo_schema";

export enum Gender {
  X = "x", // 保密
  Man = "m",
  Female = "f",
}

@Schema()
export class User extends BaseSchema {
  @Prop({
    index: true,
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

export type UserInfo = Required<User>;
