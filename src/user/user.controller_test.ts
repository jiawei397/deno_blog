import { createTestingModule } from "oak_nest";
import { assertEquals } from "std/testing/asserts.ts";
import { SessionService } from "../session/session.service.ts";
import { UserController } from "./user.controller.ts";
import { UserService } from "./user.service.ts";

Deno.test("user", async (t) => {
  const callStacks: number[] = [];
  const userService = {
    getAll() {
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

  await t.step("getAllUsers", async () => {
    const users = await userController.getAllUsers();
    assertEquals(users, []);
    assertEquals(callStacks, [1]);
  });

  await t.step("currentUser", () => {
    const userInfo = userController.currentUserInfo({
      state: {
        locals: {
          user: {
            name: "test",
            password: "123456",
          },
        },
      },
      // deno-lint-ignore no-explicit-any
    } as any);
    assertEquals(userInfo, { name: "test" });
  });
});
