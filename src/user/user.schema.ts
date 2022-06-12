import { Prop } from "../schema.ts";

export class User {
  @Prop()
  author: string;

  @Prop()
  age: number;
}
