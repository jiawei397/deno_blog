import { NotFoundException } from "oak_exception";
import { Body, Controller, Delete, Get, Params, Post, Put } from "oak_nest";
import { CreateUserDto, UpdateUserDto } from "./user.dto.ts";
import { UserService } from "./user.service.ts";

@Controller("/user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/")
  async getAll() {
    return await this.userService.getAll();
  }

  @Get("/:id")
  async getUserById(@Params("id") id: string) {
    const user = await this.userService.getUserById(id);
    if (user) {
      return user;
    } else {
      throw new NotFoundException("user not found");
    }
  }

  @Post("/")
  async createUser(@Body() params: CreateUserDto) {
    return await this.userService.addUser(params);
  }

  @Put("/:id")
  async updateUser(@Params("id") id: string, @Body() params: UpdateUserDto) {
    return await this.userService.updateUser(id, params);
  }

  @Delete("/:id")
  async deleteUser(@Params("id") id: string) {
    return await this.userService.removeUser(id);
  }
}
