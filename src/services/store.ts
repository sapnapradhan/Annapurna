import { Meal, Mess, Checkin, Review, UserProfile, ForecastItem, UserRole } from '../types';
import { MOCK_MESSES, MOCK_MEALS, MOCK_REVIEWS, MOCK_FORECASTS } from './mockData';

export interface AdminNotification {
  id: string;
  type: 'surplus' | 'checkin' | 'rescue';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

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
  private adminNotifications: AdminNotification[] = [];
  private preparedQuantities: Record<string, number> = {
    'meal-1': 400,
    'meal-2': 400,
    'meal-today-dinner': 400
  };

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

      const savedPrepared = localStorage.getItem('annapurna_prepared_qty');
      if (savedPrepared) {
        this.preparedQuantities = JSON.parse(savedPrepared);
      }

      this.messes = [...MOCK_MESSES];

      const savedMeals = localStorage.getItem('annapurna_custom_meals');
      if (savedMeals) {
        this.meals = JSON.parse(savedMeals);
      } else {
        this.meals = [...MOCK_MEALS];
        this.saveMeals();
      }

      this.reviews = [...(MOCK_REVIEWS as unknown as Review[])];
      this.forecasts = [...(MOCK_FORECASTS as unknown as ForecastItem[])];
      
      this.generateInitialNotifications();
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
    try {
      localStorage.setItem('annapurna_role', this.currentRole);
      localStorage.setItem('annapurna_current_user', JSON.stringify(this.currentUser));
    } catch (e) {
      console.warn('saveState error:', e);
    }
  }

  private saveRegisteredUsers() {
    try {
      localStorage.setItem('annapurna_registered_users', JSON.stringify(this.registeredUsers));
    } catch (e) {
      console.warn('saveRegisteredUsers error:', e);
    }
  }

  private saveCheckins() {
    try {
      localStorage.setItem('annapurna_live_checkins', JSON.stringify(this.checkins));
    } catch (e) {
      console.warn('saveCheckins error:', e);
    }
  }

  private savePreparedQuantities() {
    try {
      localStorage.setItem('annapurna_prepared_qty', JSON.stringify(this.preparedQuantities));
    } catch (e) {
      console.warn('savePreparedQuantities error:', e);
    }
  }

  private generateInitialNotifications() {
    const mealId = 'meal-2';
    const prepared = this.preparedQuantities[mealId] || 400;
    const attended = this.checkins.filter(c => c.mealId === mealId).length;
    const surplus = Math.max(prepared - attended, 0);

    this.adminNotifications = [
      {
        id: 'notif-1',
        type: 'surplus',
        title: 'AUTOMATIC SURPLUS CALCULATION ALERT',
        message: `Prepared for ${prepared} students. Real-time Attended: ${attended}. ${surplus} Surplus Meals calculated and ready for Food Rescue dispatch to NGOs.`,
        timestamp: new Date().toLocaleTimeString(),
        read: false
      }
    ];
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
        email: 'admin@authority.edu',
        role: 'authority',
        hostel: 'Central Dining Operations',
        block: 'Admin Block, Chief Warden'
      };
    } else {
      this.currentUser = this.registeredUsers[0] || {
        id: 'user-std-1',
        name: 'Aarav Sharma',
        email: 'aarav@student.edu',
        role: 'student',
        hostel: 'Hostel 1 - Mahanadi Hall',
        block: 'Block A, Room 204'
      };
    }
    this.saveState();
    this.notify();
  }

  // Universal login method fixing "M.login is not a function" error
  public login(email: string, password?: string): UserProfile {
    return this.loginUser(email);
  }

  // Universal signup method
  public signup(data: { name: string; email: string; hostel?: string; block?: string }): UserProfile {
    return this.registerStudent(data);
  }

  public logout() {
    this.currentRole = 'landing';
    try {
      localStorage.removeItem('annapurna_role');
    } catch (e) {
      console.warn('Logout storage error:', e);
    }
    this.notify();
  }

  public registerStudent(data: { name: string; email: string; hostel?: string; block?: string }): UserProfile {
    const existing = this.registeredUsers.find(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      this.currentUser = existing;
      this.currentRole = 'student';
      this.saveState();
      this.notify();
      return existing;
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

  public updateAdminPassword(currentPasswordInput: string, newPasswordInput: string): boolean {
    if (this.currentRole !== 'authority') {
      throw new Error('Unauthorized: Only Authority Admins can change admin credentials.');
    }

    const adminUser = this.registeredUsers.find(u => u.role === 'authority');
    if (!adminUser) throw new Error('Admin profile not found.');

    adminUser.password = newPasswordInput;
    this.currentUser = { ...adminUser };
    this.saveRegisteredUsers();
    this.saveState();
    this.notify();
    return true;
  }

  public loginUser(email: string, roleConstraint?: UserRole): UserProfile {
    const cleanEmail = email.trim().toLowerCase();
    
    // Check if user exists in registeredUsers
    let user = this.registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (roleConstraint && user && user.role !== roleConstraint) {
      throw new Error(`Account exists but belongs to ${user.role.toUpperCase()} portal. Please use the ${user.role.toUpperCase()} login tab.`);
    }

    if (!user) {
      if (roleConstraint === 'authority' || cleanEmail.includes('admin') || cleanEmail.includes('authority')) {
        user = {
          id: `user-auth-${Date.now()}`,
          name: 'Chief Warden Admin',
          email: cleanEmail,
          role: 'authority',
          password: 'password123',
          hostel: 'Bhubaneswar Central Campus'
        };
      } else {
        const formattedName = cleanEmail.split('@')[0].replace('.', ' ').replace('_', ' ');
        const capitalName = formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
        user = {
          id: `user-std-${Date.now()}`,
          name: capitalName,
          email: cleanEmail,
          role: 'student',
          password: 'password123',
          hostel: 'Mahanadi Hostel',
          block: 'Block A, Room 102'
        };
      }
      this.registeredUsers.push(user);
      this.saveRegisteredUsers();
    }

    this.currentUser = user;
    this.currentRole = user.role;
    this.saveState();
    this.notify();
    return user;
  }

  public setPreparedQuantity(mealId: string, qty: number) {
    this.preparedQuantities[mealId] = qty;
    this.savePreparedQuantities();

    // Trigger automatic surplus calculation notification
    const attended = this.checkins.filter(c => c.mealId === mealId).length;
    const surplus = Math.max(qty - attended, 0);

    const notif: AdminNotification = {
      id: `notif-${Date.now()}`,
      type: 'surplus',
      title: 'AUTOMATIC SURPLUS CALCULATION ALERT',
      message: `Manually set Prepared Quantity: ${qty} meals. Real-time Attended: ${attended} students. ${surplus} Surplus Meals calculated automatically for NGO Food Rescue.`,
      timestamp: new Date().toLocaleTimeString(),
      read: false
    };

    this.adminNotifications.unshift(notif);
    this.notify();
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

    // Update automatic surplus calculation notification for Admin
    const prep = this.preparedQuantities[mealId] || 400;
    const attended = this.checkins.filter(c => c.mealId === mealId).length;
    const surplus = Math.max(prep - attended, 0);

    const notif: AdminNotification = {
      id: `notif-${Date.now()}`,
      type: 'surplus',
      title: 'REAL-TIME SURPLUS RE-CALCULATION',
      message: `Student check-in recorded (${user.name}). Real-time Attended: ${attended} / Prepared: ${prep}. Updated Surplus: ${surplus} Meals remaining.`,
      timestamp: now.toLocaleTimeString(),
      read: false
    };

    this.adminNotifications.unshift(notif);
    this.notify();

    return newCheckin;
  }

  private saveMeals() {
    try {
      localStorage.setItem('annapurna_custom_meals', JSON.stringify(this.meals));
    } catch (e) {
      console.warn('saveMeals error:', e);
    }
  }

  public replaceMealsForDate(targetDate: string, newMeals: Omit<Meal, 'id'>[]): Meal[] {
    // Remove pre-existing default meals for targetDate
    this.meals = this.meals.filter(m => m.date !== targetDate);

    const createdMeals: Meal[] = newMeals.map((m, idx) => ({
      ...m,
      id: `meal-pdf-${Date.now()}-${idx}`
    }));

    this.meals.unshift(...createdMeals);
    this.saveMeals();
    this.notify();
    return createdMeals;
  }

  public addMeal(mealData: Omit<Meal, 'id'>): Meal {
    const newMeal: Meal = {
      ...mealData,
      id: `meal-${Date.now()}`
    };
    this.meals.unshift(newMeal);
    this.saveMeals();
    this.notify();
    return newMeal;
  }

  // Automatic Surplus Calculation Engine
  public getSurplusCalculation(mealId: string = 'meal-2'): { preparedQty: number; attendedCount: number; surplusQty: number; rescueStatus: string } {
    const preparedQty = this.preparedQuantities[mealId] || 400;
    const attendedCount = this.checkins.filter(c => c.mealId === mealId).length;
    const surplusQty = Math.max(preparedQty - attendedCount, 0);

    let rescueStatus = 'CALCULATING';
    if (surplusQty > 100) rescueStatus = 'HIGH SURPLUS — NGO DISPATCH READY';
    else if (surplusQty > 0) rescueStatus = 'MODERATE SURPLUS — DISPATCH RECOMMENDED';
    else rescueStatus = 'OPTIMAL — ZERO SURPLUS';

    return { preparedQty, attendedCount, surplusQty, rescueStatus };
  }

  public getLiveAttendance(mealId?: string): { checkinCount: number; totalRegistered: number; percentage: number } {
    const targetMealId = mealId || 'meal-2';
    const mealCheckins = this.checkins.filter(c => c.mealId === targetMealId);

    const checkinCount = mealCheckins.length;
    const totalRegistered = Math.max(this.registeredUsers.filter(u => u.role === 'student').length, 1);
    const percentage = Math.min(Math.round((checkinCount / totalRegistered) * 100), 100);

    return { checkinCount, totalRegistered, percentage };
  }

  public getAdminNotifications(): AdminNotification[] {
    return this.adminNotifications;
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

  public getMealCheckins(mealId: string): Checkin[] {
    return (this.checkins || []).filter(c => c.mealId === mealId || c.mealId === 'meal-1' || c.mealId === 'meal-2');
  }

  public updateMeal(mealId: string, updates: Partial<Meal>): Meal | undefined {
    const meal = this.meals.find(m => m.id === mealId);
    if (meal) {
      Object.assign(meal, updates);
      this.notify();
      return meal;
    }
    return undefined;
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
