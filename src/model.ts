// deno-lint-ignore-file require-await
import { nanoid } from "nanoid";
import { Constructor, getSchemaMetadata } from "./schema.ts";
import { Inject } from "oak_nest";

export const InjectModel = (Cls: Constructor) =>
  Inject(() => {
    return new Model(Cls.name.toLowerCase(), Cls);
  });

function getData<T = string>(key: string) {
  const str = localStorage.getItem(key);
  if (str) {
    return JSON.parse(str) as T;
  }
  return null;
}

function setData(key: string, val: unknown) {
  localStorage.setItem(key, JSON.stringify(val));
}

export class Model<T, U = T & { id: string }> {
  name: string;
  schema: Constructor | undefined;
  constructor(name: string, schema?: Constructor) {
    this.name = name;
    this.schema = schema;
  }

  private getAllIds(): string[] {
    const idsStr = localStorage.getItem(`${this.name}_ids`);
    if (idsStr) {
      return JSON.parse(idsStr);
    }
    return [];
  }

  private addToIds(id: string) {
    const ids = this.getAllIds();
    ids.push(id);
    setData(`${this.name}_ids`, ids);
    return ids.length;
  }

  /** 增加一个文档 */
  async insertOne(doc: T): Promise<string> {
    const id = nanoid();
    const newdoc = { id, ...doc };
    if (this.schema) {
      const meta = getSchemaMetadata(this.schema);
      Object.keys(newdoc).forEach((key) => {
        if (!meta[key] && key !== "id") {
          Reflect.deleteProperty(newdoc, key);
        }
      });
    }
    setData(id, newdoc);
    this.addToIds(id);
    return id;
  }

  /** 查找所有 */
  async findAll(): Promise<U[]> {
    const docs = await Promise.all(
      this.getAllIds().map((id) => this.findById(id)),
    );
    return docs.filter(Boolean) as U[];
  }

  /** 根据id查找文档 */
  async findById(id: string): Promise<U | null> {
    return getData<U>(id);
  }

  /** 根据id更新文档 */
  async findByIdAndUpdate(
    id: string,
    doc: Partial<T>,
  ): Promise<{ modifiedCount: number }> {
    const oldDoc = await this.findById(id);
    const modifiedCount = 0;
    if (oldDoc) {
      Object.assign(oldDoc, doc);
      setData(id, oldDoc);
    }
    return { modifiedCount };
  }

  /** 根据id删除文档 */
  async findByIdAndDelete(id: string): Promise<number> {
    const ids = this.getAllIds();
    const index = ids.indexOf(id);
    if (index > -1) {
      ids.splice(index, 1);
      setData(`${this.name}_ids`, ids);
      return 1;
    } else {
      console.warn(`${id} not found in ${this.name}_ids`);
      return 0;
    }
  }
}
