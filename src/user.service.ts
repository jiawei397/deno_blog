// deno-lint-ignore-file require-await
interface User {
  id: number;
  author: string;
  age: number;
}

class UserService {
  users: User[] = [
    { id: 1, author: "张三", age: 18 },
  ];

  async getAll(): Promise<User[]> {
    const usersStr = localStorage.getItem("users");
    if (usersStr) {
      return JSON.parse(usersStr);
    }
    return this.users;
  }
  async getUserById(id: number) {
    const users = await this.getAll();
    return users.find((user) => user.id === id);
  }

  private saveToFile(users: User[]) {
    localStorage.setItem("users", JSON.stringify(users));
  }

  async addUser(user: Omit<User, "id">) {
    const users = await this.getAll();
    const id = users.length + 1;
    const newUser = {
      ...user,
      id,
    };
    users.push(newUser);
    await this.saveToFile(users);
    return newUser;
  }

  async removeUser(id: number) {
    const users = await this.getAll();
    const newUsers = users.filter((user) => user.id !== id);
    await this.saveToFile(newUsers);
  }

  async updateUser(id: number, user: Omit<User, "id">) {
    const users = await this.getAll();
    const oldUser = users.find((u) => u.id === id);
    if (!oldUser) {
      throw new Error(`user not found`);
    }
    Object.assign(oldUser, user);
    await this.saveToFile(users);
  }
}

export const userService = new UserService();
