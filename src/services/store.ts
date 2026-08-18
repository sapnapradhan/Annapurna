import { 
  Meal, Checkin, Review, Consumption, Surplus, Forecast, Profile, UserRole 
} from '../types';
import { 
  MOCK_MEALS, MOCK_CHECKINS, MOCK_REVIEWS, MOCK_CONSUMPTION, 
  MOCK_SURPLUS, MOCK_FORECASTS, MOCK_PROFILES, MOCK_MESSES, TODAY_STR 
} from './mockData';

class Store {
  private role: UserRole | 'landing' = 'landing';
  private currentUser: Profile = MOCK_PROFILES[0]; // Default student
  private meals: Meal[] = [...MOCK_MEALS];
  private checkins: Checkin[] = [...MOCK_CHECKINS];
  private reviews: Review[] = [...MOCK_REVIEWS];
  private consumption: Consumption[] = [...MOCK_CONSUMPTION];
  private surplus: Surplus[] = [...MOCK_SURPLUS];
  private forecasts: Forecast[] = [...MOCK_FORECASTS];
  private activeSessions: Record<string, { token: string; expiresAt: string }> = {
    'meal-2': { token: 'ANNAPURNA-LUNCH-8842', expiresAt: `${TODAY_STR}T14:30:00Z` }
  };

  private listeners: Set<() => void> = new Set();

  constructor() {
    // Load local storage overrides if available
    const saved = localStorage.getItem('annapurna_store_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.meals) this.meals = parsed.meals;
        if (parsed.checkins) this.checkins = parsed.checkins;
        if (parsed.reviews) this.reviews = parsed.reviews;
        if (parsed.consumption) this.consumption = parsed.consumption;
        if (parsed.surplus) this.surplus = parsed.surplus;
      } catch (e) {
        console.error('Failed to parse local store', e);
      }
    }
  }

  private persist() {
    try {
      localStorage.setItem('annapurna_store_v1', JSON.stringify({
        meals: this.meals,
        checkins: this.checkins,
        reviews: this.reviews,
        consumption: this.consumption,
        surplus: this.surplus,
      }));
    } catch (e) {
      console.error('Persist error', e);
    }
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  // Auth getters & actions
  public getRole() { return this.role; }
  public getCurrentUser() { return this.currentUser; }

  public loginAs(role: UserRole) {
    this.role = role;
    this.currentUser = role === 'authority' ? MOCK_PROFILES[2] : MOCK_PROFILES[0];
    this.notify();
  }

  public logout() {
    this.role = 'landing';
    this.notify();
  }

  public updateProfile(updated: Partial<Profile>) {
    this.currentUser = { ...this.currentUser, ...updated };
    this.notify();
  }

  // Meals & Messes
  public getMesses() { return MOCK_MESSES; }
  public getMeals() { return this.meals; }

  public getTodayMeals() {
    return this.meals.filter(m => m.date === TODAY_STR);
  }

  public getMealById(id: string) {
    return this.meals.find(m => m.id === id);
  }

  public addMeal(mealData: Omit<Meal, 'id'>) {
    const newMeal: Meal = {
      ...mealData,
      id: `meal-${Date.now()}`
    };
    this.meals.push(newMeal);
    this.persist();
    return newMeal;
  }

  public updateMeal(id: string, updates: Partial<Meal>) {
    this.meals = this.meals.map(m => m.id === id ? { ...m, ...updates } : m);
    this.persist();
  }

  public copyPreviousDayMeals(targetDate: string) {
    const prevDate = new Date(new Date(targetDate).getTime() - 86400000).toISOString().split('T')[0];
    const prevMeals = this.meals.filter(m => m.date === prevDate);
    if (prevMeals.length === 0) return 0;

    const copied = prevMeals.map(m => ({
      ...m,
      id: `meal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      date: targetDate,
      status: 'draft' as const
    }));

    this.meals.push(...copied);
    this.persist();
    return copied.length;
  }

  // QR Session Management
  public getSessionForMeal(mealId: string) {
    return this.activeSessions[mealId];
  }

  public generateQRSession(mealId: string) {
    const token = `ANNAPURNA-${mealId.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const expiresAt = new Date(Date.now() + 3600000 * 3).toISOString(); // 3 hours
    this.activeSessions[mealId] = { token, expiresAt };
    this.updateMeal(mealId, { status: 'open' });
    this.notify();
    return token;
  }

  // Checkins
  public getCheckins() { return this.checkins; }

  public getMealCheckins(mealId: string) {
    return this.checkins.filter(c => c.meal_id === mealId);
  }

  public hasStudentCheckedIn(mealId: string, studentId: string) {
    return this.checkins.some(c => c.meal_id === mealId && c.student_id === studentId);
  }

  public checkInStudent(mealId: string, tokenEntered?: string) {
    const student = this.currentUser;
    if (this.hasStudentCheckedIn(mealId, student.id)) {
      return { success: false, message: 'Already checked in for this meal!' };
    }

    const session = this.activeSessions[mealId];
    if (tokenEntered && session && tokenEntered !== session.token) {
      return { success: false, message: 'Invalid or expired QR Session Token.' };
    }

    const checkin: Checkin = {
      id: `chk-${Date.now()}`,
      student_id: student.id,
      meal_id: mealId,
      checked_in_at: new Date().toISOString(),
      student_name: student.name,
      hostel: student.hostel
    };

    this.checkins.unshift(checkin);
    this.persist();
    return { success: true, checkin };
  }

  // Reviews
  public getReviews() { return this.reviews; }
  
  public getStudentReviews(studentId: string) {
    return this.reviews.filter(r => r.student_id === studentId);
  }

  public submitReview(reviewData: Omit<Review, 'id' | 'created_at' | 'student_id' | 'student_name'>) {
    const student = this.currentUser;
    const existingIdx = this.reviews.findIndex(r => r.student_id === student.id && r.meal_id === reviewData.meal_id);

    const meal = this.getMealById(reviewData.meal_id);
    const newRev: Review = {
      ...reviewData,
      id: existingIdx >= 0 ? this.reviews[existingIdx].id : `rev-${Date.now()}`,
      student_id: student.id,
      student_name: student.name,
      meal_name: meal?.name || 'Campus Meal',
      created_at: new Date().toISOString()
    };

    if (existingIdx >= 0) {
      this.reviews[existingIdx] = newRev;
    } else {
      this.reviews.unshift(newRev);
    }
    this.persist();
    return newRev;
  }

  public deleteReview(reviewId: string) {
    this.reviews = this.reviews.filter(r => r.id !== reviewId);
    this.persist();
  }

  // Consumption
  public getConsumption() { return this.consumption; }

  public logConsumption(data: Omit<Consumption, 'id' | 'created_at'>) {
    const entry: Consumption = {
      ...data,
      id: `cons-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.consumption.unshift(entry);
    this.persist();
    return entry;
  }

  // Surplus & Rescue
  public getSurplus() { return this.surplus; }

  public declareSurplus(data: Omit<Surplus, 'id' | 'created_at' | 'safety_verified' | 'pickup_confirmed'>) {
    const item: Surplus = {
      ...data,
      id: `surp-${Date.now()}`,
      safety_verified: false,
      pickup_confirmed: false,
      created_at: new Date().toISOString()
    };
    this.surplus.unshift(item);
    this.persist();
    return item;
  }

  public updateSurplusStatus(id: string, updates: Partial<Surplus>) {
    this.surplus = this.surplus.map(s => s.id === id ? { ...s, ...updates } : s);
    this.persist();
  }

  // Forecasts
  public getForecasts() {
    return this.forecasts;
  }
}

export const appStore = new Store();
