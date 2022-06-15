import { Controller, Get } from "oak_nest";
import { Render } from "../tools/ejs.ts";
import { UserService } from "./user.service.ts";

@Controller("/")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/signup")
  signup(@Render() render: Render) {
    return render("signup", {});
  }
}
