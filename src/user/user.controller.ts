import {
  assert,
  BadRequestException,
  type Context,
  Controller,
  Delete,
  Form,
  Get,
  NotFoundException,
  Params,
  Post,
  REDIRECT_BACK,
  Res,
  type Response,
  UseGuards,
  validateParams,
} from "@nest";
import { LoginedGuard, SSOGuard } from "../guards/sso.guard.ts";
import { Flash } from "../session/session.decorator.ts";
import { SessionService } from "../session/session.service.ts";
import { Render } from "../tools/ejs.ts";
import { Logger } from "../tools/log.ts";
import { CreateUserDto, SigninDto } from "./user.dto.ts";
import { UserService } from "./user.service.ts";

@Controller("/")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
    private readonly logger: Logger,
  ) {}

  @Get("/signup")
  @UseGuards(LoginedGuard)
  signupPage(@Render() render: Render) {
    return render("signup", {});
  }

  @Post("signup")
  @UseGuards(LoginedGuard)
  async signup(
    @Form() form: CreateUserDto,
    @Res() res: Response,
    @Flash() flash: Flash,
  ) {
    try {
      if (form.password !== form.repassword) {
        throw new BadRequestException("两次输入密码不一致");
      }
      this.logger.debug("注册参数校验成功");

      const filename = form.avatar.name.split("/").pop()!; // 随机文件名，直接使用就行了，也可以使用md5进行加密，这样同样的文件只会有一个
      // 保存数据
      const id = await this.userService.addUser({
        name: form.name,
        password: form.password,
        gender: form.gender,
        bio: form.bio,
        avatar: filename,
      });
      this.logger.info(`用户【${id}】注册成功`);

      // 上传图片
      await this.uploadImg(form.avatar, filename);
      this.logger.debug(`上传图片成功`);

      // 提示注册成功
      flash("success", "注册成功");
      flash("userId", id);
      res.redirect("/posts");
    } catch (e) {
      // 提示错误
      flash("error", e.message);
      this.logger.error(e.message);
      res.redirect(REDIRECT_BACK);
    }
  }

  private async uploadImg(file: File, filename: string) {
    const imgPath = "public/img";
    await Deno.mkdir(imgPath).catch((_err) => null);
    await Deno.writeFile(imgPath + "/" + filename, file.stream());
  }

  @Get("user")
  @UseGuards(SSOGuard)
  async getAllUsers() {
    return await this.userService.getAll();
  }

  @Get("signin")
  @UseGuards(LoginedGuard)
  signinPage(@Render() render: Render) {
    return render("signin", {});
  }

  /**
   * 登陆
   * 由于要跳转，所以不能直接校验参数
   */
  @Post("signin")
  @UseGuards(LoginedGuard)
  async signin(
    @Form() fields: typeof SigninDto.prototype,
    @Res() res: Response,
    @Flash() flash: Flash,
  ) {
    try {
      await validateParams(SigninDto, fields);
    } catch (error) {
      flash("error", error.message);
      return res.redirect(REDIRECT_BACK);
    }
    const username = fields.name;
    const user = await this.userService.findByName(username);
    let error = "";
    if (!user) {
      this.logger.error(`用户名${username}不存在`);
      error = "用户名或密码错误";
    } else if (fields.password !== user.password) {
      this.logger.error(`密码${fields.password}不匹配`);
      error = "用户名或密码错误";
    }
    if (error) {
      flash("error", error);
      return res.redirect(REDIRECT_BACK);
    }

    assert(user);
    flash("userId", user.id!);
    flash("success", "登录成功");

    this.logger.info(`用户${username}登陆成功`);
    // 跳转到主页
    res.redirect("posts");
  }

  @Get("currentUserInfo")
  @UseGuards(SSOGuard)
  currentUserInfo(context: Context) {
    const user = { ...context.request.states.locals?.user };
    delete user.password;
    return user;
  }

  @Get("user/:id")
  @UseGuards(SSOGuard)
  async getUserById(@Params("id") id: string) {
    const user = await this.userService.getUserById(id);
    if (user) {
      return user;
    } else {
      throw new NotFoundException("user not found");
    }
  }

  @Delete("user/:id")
  @UseGuards(SSOGuard)
  async deleteUser(@Params("id") id: string) {
    return await this.userService.removeUser(id);
  }

  @Get("signout")
  @UseGuards(SSOGuard)
  signout(@Res() res: Response, @Flash() flash: Flash) {
    flash("userId", "");
    flash("success", "登出成功");
    res.redirect("posts");
  }

  @Get("sessions")
  getSessions() {
    return this.sessionService.findAll();
  }
}
