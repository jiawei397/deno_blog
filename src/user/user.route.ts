import { Router } from "../../deps.ts";
import { CreateUserDto } from "./user.dto.ts";
import { userService } from "./user.service.ts";

export const userRouter = new Router();

userRouter
  .get("/", async (context) => {
    context.response.body = await userService.getAll();
  })
  .get("/:id", async (context) => {
    const id = context.params.id;
    const user = await userService.getUserById(id);
    if (user) {
      context.response.body = user;
    } else {
      context.response.status = 404;
      context.response.body = "user not found";
    }
  })
  .post("/", async (context) => {
    const result = context.request.body({
      type: "json",
    });
    const value: CreateUserDto = await result.value;
    if (!value.age) {
      context.response.status = 400;
      context.response.body = "age is required";
      return;
    }
    if (typeof value.age !== "number") {
      context.response.status = 400;
      context.response.body = "age must be a number";
      return;
    }
    if (value.age < 0) {
      context.response.status = 400;
      context.response.body = "age must be greater than 0";
      return;
    }
    if (!value.author) {
      context.response.status = 400;
      context.response.body = "author is required";
      return;
    }
    const id = await userService.addUser(value);
    context.response.body = id;
  })
  .put("/:id", async (context) => {
    const id = context.params.id;
    const result = context.request.body({
      type: "json",
    });
    const value = await result.value;
    const { modifiedCount } = await userService.updateUser(id, value);
    context.response.body = modifiedCount;
  })
  .delete("/:id", async (context) => {
    const id = context.params.id;
    const deletedCount = await userService.removeUser(id);
    context.response.body = deletedCount;
  });
