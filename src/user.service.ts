// deno-lint-ignore-file require-await
import { Model } from "./model.ts";

export interface User {
  id: string;
  author: string;
  age: number;
}

class UserService {
  userModel: Model<User>;
  constructor() {
    this.userModel = new Model("users");
  }

  async getAll(): Promise<User[]> {
    return this.userModel.findAll();
  }
  async getUserById(id: string) {
    return this.userModel.findById(id);
  }

  async addUser(user: Omit<User, "id">) {
    return this.userModel.insertOne(user);
  }

  async removeUser(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }

  async updateUser(id: string, user: Partial<Omit<User, "id">>) {
    return this.userModel.findByIdAndUpdate(id, user);
  }
}

export const userService = new UserService();
