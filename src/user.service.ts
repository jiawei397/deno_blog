interface User {
  id: number;
  author: string;
  age: number;
}

class UserService {
  users: User[] = [
    { id: 1, author: "张三", age: 18 },
  ];
  getAll() {
    return this.users;
  }
  getUserById(id: number) {
    return this.users.find((user) => user.id === id);
  }

  addUser(user: Omit<User, "id">) {
    const id = this.users.length + 1;
    const newUser = {
      ...user,
      id,
    };
    this.users.push(newUser);
    return newUser;
  }

  removeUser(id: number) {
    this.users = this.users.filter((user) => user.id !== id);
  }

  updateUser(id: number, user: Omit<User, "id">) {
    const oldUser = this.getUserById(id);
    if (!oldUser) {
      throw new Error(`user not found`);
    }
    Object.assign(oldUser, user);
  }
}

export const userService = new UserService();
