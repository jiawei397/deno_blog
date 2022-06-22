// deno-lint-ignore-file require-await
import { Injectable } from "oak_nest";
import { InjectModel, Model } from "deno_mongo_schema";
import { User } from "./user.schema.ts";

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private readonly userModel: Model<User>) {}

  async getAll() {
    return this.userModel.findMany({});
  }
  async getUserById(id: string) {
    return this.userModel.findById(id);
  }

  async getUsersByIds(ids: string[]) {
    return this.userModel.findMany({
      _id: { $in: ids },
    });
  }

  async addUser(user: User) {
    const id = await this.userModel.insertOne(user);
    return id.toString();
  }

  async removeUser(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }

  async updateUser(id: string, user: Partial<User>) {
    return this.userModel.findByIdAndUpdate(id, user);
  }

  findByName(name: string) {
    return this.userModel.findOne({ name });
  }
}
