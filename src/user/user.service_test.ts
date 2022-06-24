import { assertEquals } from "std/testing/asserts.ts";
import { Gender } from "./user.schema.ts";
import { UserService } from "./user.service.ts";

Deno.test("user service", async (t) => {
  const callStacks: number[] = [];
  const model = {
    findMany() {
      callStacks.push(1);
      return Promise.resolve([]);
    },
    insertOne() {
      callStacks.push(2);
      return 1;
    },
  };
  // deno-lint-ignore no-explicit-any
  const userService = new UserService(model as any);

  await t.step("getAllUsers", async () => {
    const users = await userService.getAll();
    assertEquals(users, []);
    assertEquals(callStacks, [1]);

    callStacks.length = 0;
  });

  await t.step("addUser", async () => {
    const id = await userService.addUser({
      name: "test",
      password: "",
      avatar: "",
      gender: Gender.Man,
      bio: "",
    });
    assertEquals(id, "1");
    assertEquals(typeof id, "string");

    assertEquals(callStacks, [2]);
    callStacks.length = 0;
  });
});
