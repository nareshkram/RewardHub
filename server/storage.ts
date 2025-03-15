import { 
  User, InsertUser, Task, InsertTask, 
  Withdrawal, InsertWithdrawal, UpdateUserPayment 
} from "@shared/schema";

export interface IStorage {
  // User operations
  createUser(user: InsertUser): Promise<User>;
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  updateUserPoints(id: number, points: number): Promise<User>;
  updateUserPaymentInfo(id: number, paymentInfo: UpdateUserPayment): Promise<User>;
  updateUserPreferences(id: number, preferences: { preferredLanguage: string; darkMode: boolean }): Promise<User>;

  // Task operations
  createTask(task: InsertTask): Promise<Task>;
  getTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  completeTask(userId: number, taskId: number): Promise<void>;

  // Withdrawal operations
  createWithdrawal(withdrawal: InsertWithdrawal & { status: string }): Promise<Withdrawal>;
  getWithdrawals(userId: number): Promise<Withdrawal[]>;
  updateWithdrawalStatus(id: number, status: string): Promise<Withdrawal>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tasks: Map<number, Task>;
  private completedTasks: Set<string>;
  private withdrawals: Map<number, Withdrawal>;
  private currentIds: {
    user: number;
    task: number;
    withdrawal: number;
  };

  constructor() {
    this.users = new Map();
    this.tasks = new Map();
    this.completedTasks = new Set();
    this.withdrawals = new Map();
    this.currentIds = {
      user: 1,
      task: 1,
      withdrawal: 1
    };

    // Add some initial tasks
    this.initializeTasks();
  }

  private initializeTasks() {
    const initialTasks: InsertTask[] = [
      {
        title: "Watch an Ad",
        description: "Watch a 30-second advertisement to earn points",
        points: 10,
        type: "ad"
      },
      {
        title: "Complete Survey",
        description: "Share your opinion in a quick 2-minute survey",
        points: 50,
        type: "survey"
      },
      {
        title: "Play Mini-Game",
        description: "Play a quick puzzle game to earn points",
        points: 25,
        type: "game"
      }
    ];

    initialTasks.forEach(task => this.createTask(task));
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.user++;
    const user: User = {
      ...insertUser,
      id,
      points: 0,
      upiId: null,
      bankAccount: null,
      ifscCode: null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async updateUserPoints(id: number, points: number): Promise<User> {
    const user = await this.getUser(id);
    if (!user) throw new Error("User not found");

    const updatedUser = {
      ...user,
      points: user.points + points
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateUserPaymentInfo(id: number, paymentInfo: UpdateUserPayment): Promise<User> {
    const user = await this.getUser(id);
    if (!user) throw new Error("User not found");

    const updatedUser = {
      ...user,
      ...paymentInfo
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.currentIds.task++;
    const task: Task = { ...insertTask, id };
    this.tasks.set(id, task);
    return task;
  }

  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async completeTask(userId: number, taskId: number): Promise<void> {
    const key = `${userId}-${taskId}`;
    if (this.completedTasks.has(key)) {
      throw new Error("Task already completed");
    }

    const task = await this.getTask(taskId);
    if (!task) throw new Error("Task not found");

    await this.updateUserPoints(userId, task.points);
    this.completedTasks.add(key);
  }

  async createWithdrawal(insertWithdrawal: InsertWithdrawal & { status: string }): Promise<Withdrawal> {
    const id = this.currentIds.withdrawal++;
    const withdrawal: Withdrawal = {
      ...insertWithdrawal,
      id,
      paymentId: null,
      createdAt: new Date()
    };
    this.withdrawals.set(id, withdrawal);
    return withdrawal;
  }

  async getWithdrawals(userId: number): Promise<Withdrawal[]> {
    return Array.from(this.withdrawals.values())
      .filter(w => w.userId === userId);
  }

  async updateWithdrawalStatus(id: number, status: string): Promise<Withdrawal> {
    const withdrawal = this.withdrawals.get(id);
    if (!withdrawal) throw new Error("Withdrawal not found");

    const updatedWithdrawal = { ...withdrawal, status };
    this.withdrawals.set(id, updatedWithdrawal);
    return updatedWithdrawal;
  }

  async updateUserPreferences(id: number, preferences: { preferredLanguage: string; darkMode: boolean }): Promise<User> {
    const user = await this.getUser(id);
    if (!user) throw new Error("User not found");

    const updatedUser = {
      ...user,
      ...preferences
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
}

export const storage = new MemStorage();