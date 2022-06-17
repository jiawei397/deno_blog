import { BadRequestException, NotFoundException } from "oak_exception";
import {
  assert,
  Context,
  Controller,
  Delete,
  FormDataFormattedBody,
  Get,
  Params,
  Post,
  REDIRECT_BACK,
  Res,
  Response,
  UploadedFile,
  validateParams,
} from "oak_nest";
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
  signupPage(@Render() render: Render) {
    return render("signup", {});
  }

  @Post("signup")
  async signup(
    @UploadedFile() params: FormDataFormattedBody<CreateUserDto>,
    @Res() res: Response,
    @Flash() flash: Flash,
  ) {
    try {
      const files = params.files;
      // 校验参数
      if (
        !files || files.length === 0 || !files[0].originalName ||
        !files[0].filename
      ) {
        throw new BadRequestException("必须上传头像");
      }
      const form = params.fields;
      await validateParams(CreateUserDto, form);
      if (form.password !== form.repassword) {
        throw new BadRequestException("两次输入密码不一致");
      }
      this.logger.debug("注册参数校验成功");

      const filename = files[0].filename.split("/").pop()!; // 随机文件名，直接使用就行了，也可以使用md5进行加密，这样同样的文件只会有一个
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
      await this.uploadImg(files[0].filename, filename);
      this.logger.debug(`上传图片成功`);

      //TODO  提示注册成功
      flash("success", "注册成功");
      flash("userId", id);
      res.redirect("/posts");
    } catch (e) {
      //TODO 提示错误
      flash("error", e.message);
      this.logger.error(e.message);
      res.redirect(REDIRECT_BACK);
    }
  }

  private async uploadImg(tmpPath: string, filename: string) {
    const imgPath = "public/img";
    await Deno.mkdir(imgPath).catch((_err) => null);
    await Deno.copyFile(tmpPath, imgPath + "/" + filename);
  }

  @Get("user")
  async getAllUsers() {
    return await this.userService.getAll();
  }

  @Get("signin")
  signinPage(@Render() render: Render) {
    return render("signin", {});
  }

  /** 登陆 */
  @Post("signin")
  async signin(
    @UploadedFile() params: FormDataFormattedBody<SigninDto>,
    @Res() res: Response,
    @Flash() flash: Flash,
  ) {
    const fields = params.fields;
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
  currentUserInfo(context: Context) {
    const user = { ...context.state.locals?.user };
    delete user.password;
    return user;
  }

  @Get("user/:id")
  async getUserById(@Params("id") id: string) {
    const user = await this.userService.getUserById(id);
    if (user) {
      return user;
    } else {
      throw new NotFoundException("user not found");
    }
  }

  @Delete("user/:id")
  async deleteUser(@Params("id") id: string) {
    return await this.userService.removeUser(id);
  }

  @Get("signout")
  async signout(@Res() res: Response, @Flash() flash: Flash, context: Context) {
    const sessionId = context.state.locals?.sessionId;
    if (sessionId) {
      try {
        await this.sessionService.deleteById(sessionId);
      } catch (error) {
        flash("error", error.message);
        res.redirect(REDIRECT_BACK);
        return;
      }
    }
    flash("success", "登出成功");
    res.redirect("posts");
  }
}
