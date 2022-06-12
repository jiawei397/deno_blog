// deno-lint-ignore-file require-await
import { Model } from "../model.ts";
import { User } from "./user.schema.ts";

class UserService {
  userModel: Model<User>;
  constructor() {
    this.userModel = new Model("users", User);
  }

  async getAll() {
    return this.userModel.findAll();
  }
  async getUserById(id: string) {
    return this.userModel.findById(id);
  }

  async addUser(user: User) {
    return this.userModel.insertOne(user);
  }

  async removeUser(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }

  async updateUser(id: string, user: Partial<User>) {
    return this.userModel.findByIdAndUpdate(id, user);
  }
}

export const userService = new UserService();
