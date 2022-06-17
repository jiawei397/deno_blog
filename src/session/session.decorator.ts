import { Context, createParamDecorator } from "oak_nest";
import { CreateSession } from "./session.interface.ts";

export const Flash = createParamDecorator(
  (context: Context): Flash => {
    return (key, val) => {
      context.state[key] = val;
    };
  },
);

export type Flash = (
  key: keyof CreateSession,
  val: string | boolean | number,
) => void;
