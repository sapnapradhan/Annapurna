import { Meal, Mess, Checkin, Review, UserProfile, ForecastItem, UserRole } from '../types';
import { MOCK_MESSES, MOCK_MEALS, MOCK_REVIEWS, MOCK_FORECASTS } from './mockData';

class AppStore {
  private currentRole: UserRole | 'landing' = 'landing';
  private currentUser: UserProfile = {
    id: 'user-std-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@university.edu.in',
    role: 'student',
    hostel: 'Hostel 1 - Mahanadi Hall',
    block: 'Block A, Room 204'
  };

  private messes: Mess[] = [];
  private meals: Meal[] = [];
  private checkins: Checkin[] = [];
  private reviews: Review[] = [];
  private forecasts: ForecastItem[] = [];
  private registeredUsers: UserProfile[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      const savedRole = localStorage.getItem('annapurna_role');
      if (savedRole) this.currentRole = savedRole as UserRole | 'landing';

      const savedUser = localStorage.getItem('annapurna_current_user');
      if (savedUser) this.currentUser = JSON.parse(savedUser);

      const savedUsers = localStorage.getItem('annapurna_registered_users');
      if (savedUsers) {
        this.registeredUsers = JSON.parse(savedUsers);
      } else {
        this.registeredUsers = [
          this.currentUser,
          {
            id: 'user-std-2',
            name: 'Ananya Roy',
            email: 'ananya.roy@university.edu.in',
            role: 'student',
            hostel: 'Hostel 2 - Daya Hall',
            block: 'Block B, Room 102'
          },
          {
            id: 'user-std-3',
            name: 'Rohan Verma',
            email: 'rohan.verma@university.edu.in',
            role: 'student',
            hostel: 'Kalinga Boys Hostel',
            block: 'Block C, Room 305'
          }
        ];
        this.saveRegisteredUsers();
      }

      const savedCheckins = localStorage.getItem('annapurna_live_checkins');
      if (savedCheckins) {
        this.checkins = JSON.parse(savedCheckins);
      } else {
        this.checkins = [];
        this.saveCheckins();
      }

      this.messes = [...MOCK_MESSES];
      this.meals = [...MOCK_MEALS];
      this.reviews = [...(MOCK_REVIEWS as unknown as Review[])];
      this.forecasts = [...(MOCK_FORECASTS as unknown as ForecastItem[])];
    } catch (e) {
      console.warn('Error loading store state:', e);
      this.messes = [...MOCK_MESSES];
      this.meals = [...MOCK_MEALS];
      this.checkins = [];
      this.reviews = [];
      this.forecasts = [];
    }
  }

  private saveState() {
    localStorage.setItem('annapurna_role', this.currentRole);
    localStorage.setItem('annapurna_current_user', JSON.stringify(this.currentUser));
  }

  private saveRegisteredUsers() {
    localStorage.setItem('annapurna_registered_users', JSON.stringify(this.registeredUsers));
  }

  private saveCheckins() {
    localStorage.setItem('annapurna_live_checkins', JSON.stringify(this.checkins));
  }

  public getRole(): UserRole | 'landing' {
    return this.currentRole;
  }

  public setRole(role: UserRole | 'landing') {
    this.currentRole = role;
    this.saveState();
    this.notify();
  }

  public loginAs(role: UserRole) {
    this.currentRole = role;
    if (role === 'authority') {
      this.currentUser = {
        id: 'user-auth-1',
        name: 'Dr. Rajesh Mohanty',
        email: 'rajesh.mohanty@university.edu.in',
        role: 'authority',
        hostel: 'Central Dining Operations',
        block: 'Admin Block, Chief Warden'
      };
    } else {
      this.currentUser = this.registeredUsers[0] || {
        id: 'user-std-1',
        name: 'Aarav Sharma',
        email: 'aarav.sharma@university.edu.in',
        role: 'student',
        hostel: 'Hostel 1 - Mahanadi Hall',
        block: 'Block A, Room 204'
      };
    }
    this.saveState();
    this.notify();
  }

  public logout() {
    this.currentRole = 'landing';
    localStorage.removeItem('annapurna_role');
    this.notify();
  }

  public registerStudent(data: { name: string; email: string; hostel?: string; block?: string }): UserProfile {
    const existing = this.registeredUsers.find(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      throw new Error('This email address is already registered. Please log in instead.');
    }

    const newUser: UserProfile = {
      id: `user-std-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: 'student',
      hostel: data.hostel || 'Hostel 1 - Mahanadi Hall',
      block: data.block || 'Block A'
    };

    this.registeredUsers.push(newUser);
    this.saveRegisteredUsers();

    this.currentUser = newUser;
    this.currentRole = 'student';
    this.saveState();
    this.notify();

    return newUser;
  }

  public loginUser(email: string): UserProfile {
    const user = this.registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      this.currentUser = user;
      this.currentRole = user.role;
      this.saveState();
      this.notify();
      return user;
    }

    if (email.includes('authority') || email.includes('admin')) {
      const authUser: UserProfile = {
        id: 'user-auth-1',
        name: 'Dr. Rajesh Mohanty',
        email,
        role: 'authority',
        hostel: 'Central Dining Operations',
        block: 'Admin Block, Chief Warden'
      };
      this.currentUser = authUser;
      this.currentRole = 'authority';
      this.saveState();
      this.notify();
      return authUser;
    }

    // Default dynamic login for student
    const newStd: UserProfile = {
      id: `user-std-${Date.now()}`,
      name: email.split('@')[0].replace('.', ' '),
      email,
      role: 'student',
      hostel: 'Hostel 1 - Mahanadi Hall',
      block: 'Block A'
    };
    this.registeredUsers.push(newStd);
    this.saveRegisteredUsers();

    this.currentUser = newStd;
    this.currentRole = 'student';
    this.saveState();
    this.notify();
    return newStd;
  }

  public recordCheckin(mealId: string, messId: string = 'mess-1'): Checkin {
    const user = this.currentUser;
    const now = new Date();

    const existingCheckin = this.checkins.find(
      c => c.studentId === user.id && c.mealId === mealId && c.messId === messId
    );

    if (existingCheckin) {
      return existingCheckin;
    }

    const newCheckin: Checkin = {
      id: `chk-${Date.now()}`,
      studentId: user.id,
      studentName: user.name,
      hostel: user.hostel || 'Hostel 1 - Mahanadi Hall',
      mealId,
      messId,
      timestamp: now.toISOString(),
      verifiedBy: 'Turnstile Scanner A1'
    };

    this.checkins.unshift(newCheckin);
    this.saveCheckins();
    this.notify();

    return newCheckin;
  }

  public getLiveAttendance(mealId?: string): { checkinCount: number; totalRegistered: number; percentage: number } {
    const targetMealId = mealId || 'meal-2';
    const mealCheckins = this.checkins.filter(c => c.mealId === targetMealId);

    const checkinCount = mealCheckins.length;
    const totalRegistered = Math.max(this.registeredUsers.filter(u => u.role === 'student').length, 1);
    const percentage = Math.min(Math.round((checkinCount / totalRegistered) * 100), 100);

    return { checkinCount, totalRegistered, percentage };
  }

  public getCurrentUser(): UserProfile {
    return this.currentUser;
  }

  public getMesses(): Mess[] {
    return this.messes;
  }

  public getMeals(): Meal[] {
    return this.meals;
  }

  public getTodayMeals(): Meal[] {
    return this.meals || [];
  }

  public getCheckins(): Checkin[] {
    return this.checkins;
  }

  public getReviews(): Review[] {
    return this.reviews;
  }

  public getForecasts(): ForecastItem[] {
    return this.forecasts;
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(l => l());
  }
}

export const appStore = new AppStore();
