// deno-lint-ignore-file require-await no-explicit-any ban-types
import { nanoid } from "nanoid";
import { Constructor, getSchemaMetadata, SchemaType } from "./schema.ts";
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

export type ModelWithId<T> = T & { id: string };

export class Model<T extends object, U = ModelWithId<T>> {
  name: string;
  schema: Constructor | undefined;
  expiredKey: string;
  constructor(name: string, schema?: Constructor) {
    this.name = name;
    this.schema = schema;
    this.expiredKey = name + "_expired";
    setInterval(this.clearExpired.bind(this), 1000 * 5);
  }

  private getExpiredMap(): Record<string, number> {
    return getData(this.expiredKey) || {};
  }

  private async clearExpired() {
    const expiredMap = this.getExpiredMap();
    if (Object.keys(expiredMap).length === 0) {
      return;
    }
    const now = Date.now();
    await Promise.all(
      Object.keys(expiredMap).map((key) => {
        if (expiredMap[key] <= now) {
          console.debug("clear expired", this.expiredKey, key, expiredMap[key]);
          delete expiredMap[key];
          return this.findByIdAndDelete(key);
        }
      }),
    );
    setData(this.expiredKey, expiredMap);
  }

  private getAllIds(): string[] {
    return getData(`${this.name}_ids`) || [];
  }

  private addToIds(id: string) {
    const ids = this.getAllIds();
    ids.push(id);
    setData(`${this.name}_ids`, ids);
    return ids.length;
  }

  /** 校验参数 */
  private async checkProps(doc: T, id: string) {
    const newdoc = {} as T;
    if (this.schema) {
      const meta = getSchemaMetadata(this.schema);
      await Promise.all(
        Object.keys(meta).map(async (key) => {
          const k = key as keyof T;
          const options: SchemaType = meta[key];
          if (options.default && doc[k] === undefined) {
            newdoc[k] = typeof options.default === "function"
              ? ((options.default === Date || options.default === Date.now)
                ? new Date()
                : options.default())
              : options.default;
          } else if (doc[k] !== undefined) {
            newdoc[k] = doc[k];
          }
          if (options.required) {
            if (doc[k] === undefined) {
              if (Array.isArray(options.required) && options.required[0]) {
                throw new Error(options.required[1]);
              } else {
                throw new Error(`${key} is required`);
              }
            }
          }
          if (options.unique) {
            const exist = await this.findOne(
              { [k]: doc[k] } as unknown as Partial<U>,
            );
            if (exist) {
              throw new Error(`${key} is unique`);
            }
          }
          if (options.expires) {
            const expiredMap = this.getExpiredMap();
            const expired = Date.now() + options.expires * 1000;
            expiredMap[id] = expired;
            setData(this.expiredKey, expiredMap);
          }
        }),
      );
    }
    // console.log(newdoc);
    return newdoc;
  }

  /** 增加一个文档 */
  async insertOne(doc: T): Promise<string> {
    const id = nanoid();
    const newdoc = await this.checkProps(doc, id);
    setData(id, {
      id,
      ...newdoc,
    });
    this.addToIds(id);
    return id;
  }

  async findMany(options: Partial<U>) {
    const docs = await this.findAll();
    return docs.filter((doc: any) => {
      return Object.keys(options).every((key) => {
        return doc[key] === (options as any)[key];
      });
    });
  }

  async findOne(options: Partial<U>) {
    const docs = await this.findAll();
    return docs.find((doc: any) => {
      return Object.keys(options).every((key) => {
        return doc[key] === (options as any)[key];
      });
    });
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

  async findByIds(ids: string[]): Promise<U[]> {
    const arr = await Promise.all(ids.map((id) => this.findById(id)));
    return arr.filter(Boolean) as U[];
  }

  /** 根据id更新文档 */
  async findByIdAndUpdate(
    id: string,
    doc: Partial<T>,
  ): Promise<{ modifiedCount: number }> {
    const oldDoc = await this.findById(id);
    const modifiedCount = 0;
    if (oldDoc) {
      for (const key in doc) {
        if (doc[key] === undefined) {
          Reflect.deleteProperty(doc, key);
        }
      }
      Object.assign(oldDoc, doc);
      setData(id, oldDoc);
    }
    return { modifiedCount };
  }

  /** 根据id删除文档 */
  async findByIdAndDelete(id: string): Promise<number> {
    localStorage.removeItem(id);
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
