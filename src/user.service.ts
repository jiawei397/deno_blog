// deno-lint-ignore-file require-await
interface User {
  id: number;
  author: string;
  age: number;
}

class UserService {
  async getAll(): Promise<User[]> {
    const userIdsStr = localStorage.getItem("users_ids");
    if (userIdsStr) {
      const ids: string[] = JSON.parse(userIdsStr);
      const users = await Promise.all(
        ids.map((id) => this.getUserById(parseInt(id))),
      );
      return users.filter(Boolean) as User[];
    }
    return [];
  }
  async getUserById(id: number): Promise<User | null> {
    const userStr = localStorage.getItem(`users_${id}`);
    if (userStr) {
      return JSON.parse(userStr) as User;
    }
    return null;
  }

  generateId(): number {
    const idStr = localStorage.getItem("users_id");
    if (idStr) {
      const id = parseInt(idStr, 10) + 1;
      localStorage.setItem("users_id", id.toString()); // 取一次就得改一次
      return id;
    } else {
      localStorage.setItem("users_id", "1");
      return 1;
    }
  }

  async addUser(user: Omit<User, "id">) {
    const id = this.generateId();
    const newUser = {
      ...user,
      id,
    };
    const userIdsStr = localStorage.getItem("users_ids");
    const userIds = userIdsStr ? JSON.parse(userIdsStr) : [];
    userIds.push(id);
    localStorage.setItem(`users_${id}`, JSON.stringify(newUser));
    localStorage.setItem("users_ids", JSON.stringify(userIds));
    return newUser;
  }

  async removeUser(id: number) {
    const userIdsStr = localStorage.getItem("users_ids");
    if (!userIdsStr) {
      return;
    }
    const userIds = JSON.parse(userIdsStr);
    const index = userIds.indexOf(id);
    if (index > -1) {
      userIds.splice(index, 1);
      localStorage.setItem("users_ids", JSON.stringify(userIds));
    }
  }

  async updateUser(id: number, user: Omit<User, "id">) {
    const oldUser = await this.getUserById(id);
    if (!oldUser) {
      return;
    }
    Object.assign(oldUser, user);
    localStorage.setItem(`users_${id}`, JSON.stringify(oldUser));
  }
}

export const userService = new UserService();
