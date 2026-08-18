export type UserRole = 'student' | 'authority';

export type MealType = 'breakfast' | 'lunch' | 'snacks' | 'dinner';

export type MealStatus = 'draft' | 'published' | 'open' | 'closed' | 'cancelled';

export type QuantityFeedback = 'too_little' | 'just_right' | 'too_much';

export interface Profile {
  id: string;
  role: UserRole;
  name: string;
  student_id?: string;
  hostel?: string;
  block?: string;
  dietary_pref?: string;
}

export interface Mess {
  id: string;
  name: string;
  location: string;
  capacity: number;
}

export interface Meal {
  id: string;
  date: string; // YYYY-MM-DD
  meal_type: MealType;
  name: string;
  description: string;
  items: string[];
  image_url: string;
  mess_id: string;
  open_time: string; // HH:MM
  close_time: string; // HH:MM
  expected_qty: number;
  price: number;
  status: MealStatus;
}

export interface MealSession {
  id: string;
  meal_id: string;
  session_token: string;
  expires_at: string;
  created_at: string;
}

export interface Checkin {
  id: string;
  student_id: string;
  meal_id: string;
  checked_in_at: string;
  student_name?: string;
  hostel?: string;
}

export interface Review {
  id: string;
  student_id: string;
  meal_id: string;
  stars: number; // 1-5
  quantity_feedback: QuantityFeedback;
  taste_rating: number; // 1-5
  quality_rating: number; // 1-5
  temperature_rating: number; // 1-5
  variety_rating: number; // 1-5
  comment: string;
  created_at: string;
  student_name?: string;
  meal_name?: string;
}

export interface Consumption {
  id: string;
  meal_id: string;
  prepared: number;
  served: number;
  remaining: number;
  wasted: number;
  redistributed: number;
  created_at: string;
}

export interface Surplus {
  id: string;
  meal_id: string;
  food: string;
  quantity: number; // portions or kg
  prep_time: string;
  temperature: string;
  storage_condition: string;
  packaging: string;
  pickup_deadline: string;
  location: string;
  safety_verified: boolean;
  matched_recipient?: string;
  pickup_confirmed: boolean;
  created_at: string;
}

export interface Forecast {
  meal_id: string;
  date: string;
  meal_type: MealType;
  meal_name: string;
  mess_id: string;
  expected_qty: number;
  historical_attendance: number;
  participation_rate: number;
  predicted_demand: number;
  recommended_prep_qty: number;
}
