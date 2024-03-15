import { Context, createParamDecorator } from "@nest";
import { CreateSession } from "./session.interface.ts";

export const Flash = createParamDecorator(
  (context: Context): Flash => {
    return (key, val) => {
      context.request.states[key] = val;
    };
  },
);

export type Flash = (
  key: keyof CreateSession,
  val: string | boolean | number,
) => void;

export const UserParam = createParamDecorator(
  (context: Context) => {
    return context.request.states.session?.user;
  },
);
