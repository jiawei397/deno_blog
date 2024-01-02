import { Injectable } from "@nest";
import { Session } from "./session.schema.ts";
import { CreateSession, UpdateSession } from "./session.interface.ts";
import { InjectModel, Model } from "deno_mongo_schema";

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(Session) private readonly model: Model<Session>,
  ) {
  }
  async save(params: CreateSession): Promise<string> {
    const id = await this.model.insertOne(params);
    return id.toString();
  }

  findById(id: string, isWithUserInfo: boolean) {
    return this.model.findById(id, {
      populates: isWithUserInfo
        ? {
          "user": true,
        }
        : undefined,
    });
  }

  update(params: UpdateSession) {
    return this.model.findByIdAndUpdate(params.id, params);
  }

  deleteById(id: string) {
    return this.model.findByIdAndDelete(id);
  }

  findAll(): Promise<Session[]> {
    return this.model.findMany();
  }
}
