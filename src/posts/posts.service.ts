import { Injectable } from "oak_nest";
import { InjectModel, Model } from "../model.ts";
import { CreatePostDto } from "./posts.dto.ts";
import { Post } from "./posts.schema.ts";

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post) private readonly model: Model<Post>) {}

  save(params: CreatePostDto): Promise<string> {
    return this.model.insertOne({
      ...params,
      pv: 0,
    });
  }
}
