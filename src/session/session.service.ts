import { Injectable } from "oak_nest";
import { InjectModel, Model } from "../model.ts";
import { Session } from "./session.schema.ts";
import { CreateSession, UpdateSession } from "./session.interface.ts";
import { UserService } from "../user/user.service.ts";

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(Session) private readonly model: Model<Session>,
    private readonly userService: UserService,
  ) {
  }
  async save(params: CreateSession): Promise<string> {
    const id = await this.model.insertOne(params);
    return id.toString();
  }

  async findById(id: string, isWithUserInfo: boolean) {
    const session = await this.model.findById(id);
    if (!session) {
      return;
    }
    if (isWithUserInfo && session.userId) {
      session.user = await this.userService.getUserById(session.userId);
    }
    return session;
  }

  update(params: UpdateSession) {
    return this.model.findByIdAndUpdate(params.id, params);
  }

  deleteById(id: string) {
    return this.model.findByIdAndDelete(id);
  }
}
