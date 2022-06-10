// deno-lint-ignore-file require-await
interface User {
  id: number;
  author: string;
  age: number;
}

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

class UserService {
  async getAll(): Promise<User[]> {
    const ids = getData<string[]>("users_ids");
    if (ids) {
      const users = await Promise.all(
        ids.map((id) => this.getUserById(parseInt(id))),
      );
      return users.filter(Boolean) as User[];
    }
    return [];
  }
  async getUserById(id: number): Promise<User | null> {
    return getData<User>(`users_${id}`);
  }

  generateId(): number {
    const idStr = getData("users_id");
    if (idStr) {
      const id = parseInt(idStr, 10) + 1;
      setData("users_id", id); // 取一次就得改一次
      return id;
    } else {
      setData("users_id", 1);
      return 1;
    }
  }

  async addUser(user: Omit<User, "id">) {
    const id = this.generateId();
    const newUser = {
      ...user,
      id,
    };
    const userIds = getData<number[]>("users_ids") || [];
    userIds.push(id);
    setData(`users_${id}`, newUser);
    setData("users_ids", userIds);
    return newUser;
  }

  async removeUser(id: number) {
    const userIds = getData<number[]>("users_ids");
    if (!userIds) {
      return;
    }
    const index = userIds.indexOf(id);
    if (index > -1) {
      userIds.splice(index, 1);
      setData("users_ids", userIds);
    }
  }

  async updateUser(id: number, user: Omit<User, "id">) {
    const oldUser = await this.getUserById(id);
    if (!oldUser) {
      return;
    }
    Object.assign(oldUser, user);
    setData(`users_${id}`, oldUser);
  }
}

export const userService = new UserService();
