import { Router } from "../deps.ts";
import { userRouter } from "./user/user.route.ts";

const router = new Router();
router.use("/user", userRouter.routes());

router.get("/", (context) => {
  context.response.body = "hello world";
});

export { router };
