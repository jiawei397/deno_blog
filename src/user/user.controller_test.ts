import { createTestingModule } from "oak_nest";
import { assertEquals } from "std/testing/asserts.ts";
import { SessionService } from "../session/session.service.ts";
import { UserController } from "./user.controller.ts";
import { UserService } from "./user.service.ts";

Deno.test("getAllUsers", async () => {
  const callStacks: number[] = [];
  const userService = {
    getAllUsers() {
      callStacks.push(1);
      return Promise.resolve([]);
    },
  };
  const moduleRef = await createTestingModule({
    controllers: [UserController],
  })
    .overrideProvider(UserService, userService)
    .overrideProvider(SessionService, {})
    .compile();
  const userController = await moduleRef.get(UserController);
  assertEquals(userController.getAllUsers(), []);
  assertEquals(callStacks, [1]);
});
