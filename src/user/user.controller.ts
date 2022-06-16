import { BadRequestException, NotFoundException } from "oak_exception";
import {
  Controller,
  Delete,
  FormDataFormattedBody,
  Get,
  Params,
  Post,
  Res,
  Response,
  UploadedFile,
  validateParams,
} from "oak_nest";
import { Render } from "../tools/ejs.ts";
import { Logger } from "../tools/log.ts";
import { CreateUserDto } from "./user.dto.ts";
import { UserService } from "./user.service.ts";

@Controller("/")
export class UserController {
  constructor(
    private readonly userService: UserService,
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
      res.redirect("/posts");
    } catch (e) {
      //TODO 提示错误
      this.logger.error(e.message);
      res.redirect("/signup");
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
}
