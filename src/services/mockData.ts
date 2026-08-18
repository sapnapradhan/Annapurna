import { Mess, Meal, Checkin, Review, Consumption, Surplus, Forecast, Profile } from '../types';

export const TODAY_STR = new Date().toISOString().split('T')[0];
export const TOMORROW_STR = new Date(Date.now() + 86400000).toISOString().split('T')[0];

export const MOCK_MESSES: Mess[] = [
  { id: 'mess-1', name: 'Main Dining Hall (North Campus)', location: 'North Block - Sector 3', capacity: 650 },
  { id: 'mess-2', name: 'Nilgiri Mess (South Block)', location: 'South Hostel Complex', capacity: 450 },
  { id: 'mess-3', name: 'Vindhya Central Dining', location: 'Central Academic Square', capacity: 800 },
];

export const MOCK_PROFILES: Profile[] = [
  { id: 'student-1', role: 'student', name: 'Aarav Sharma', student_id: '2024CS1042', hostel: 'Nilgiri Hall', block: 'B-Block, Rm 204', dietary_pref: 'Vegetarian' },
  { id: 'student-2', role: 'student', name: 'Priya Ananth', student_id: '2023EE1089', hostel: 'Kaveri Hostel', block: 'A-Block, Rm 112', dietary_pref: 'Jain' },
  { id: 'authority-1', role: 'authority', name: 'Dr. Rameshwar V. Verma', hostel: 'Administration', block: 'Food Ops Directorate' }
];

export const MOCK_MEALS: Meal[] = [
  {
    id: 'meal-1',
    date: TODAY_STR,
    meal_type: 'breakfast',
    name: 'South Indian Morning Feast',
    description: 'Crisp Ghee Dosa, Steamed Idlis with Coconut Chutney, Sambhar, and Filter Coffee.',
    items: ['Ghee Masala Dosa', 'Steamed Rice Idli (2 pcs)', 'Coconut Chutney', 'Spicy Tomato Chutney', 'Traditional Sambhar', 'South Indian Filter Coffee'],
    image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    mess_id: 'mess-1',
    open_time: '07:30',
    close_time: '09:30',
    expected_qty: 480,
    price: 0,
    status: 'closed',
  },
  {
    id: 'meal-2',
    date: TODAY_STR,
    meal_type: 'lunch',
    name: 'Shahi North Indian Thali',
    description: 'Paneer Butter Masala, Yellow Dal Tadka, Fragrant Jeera Rice, Tandoori Roti, and Gulab Jamun.',
    items: ['Paneer Butter Masala', 'Yellow Dal Tadka', 'Jeera Basmati Rice', 'Butter Roti (3 pcs)', 'Cucumber Mint Raita', 'Gulab Jamun (1 pc)'],
    image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    mess_id: 'mess-1',
    open_time: '12:00',
    close_time: '14:30',
    expected_qty: 550,
    price: 0,
    status: 'open',
  },
  {
    id: 'meal-3',
    date: TODAY_STR,
    meal_type: 'snacks',
    name: 'Evening High Tea & Samosa',
    description: 'Fresh Potato Samosas with Green Chutney and Masala Chai.',
    items: ['Crispy Punjabi Samosa (2 pcs)', 'Mint Chutney', 'Sweet Tamarind Chutney', 'Hot Masala Chai'],
    image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    mess_id: 'mess-1',
    open_time: '17:00',
    close_time: '18:15',
    expected_qty: 400,
    price: 0,
    status: 'published',
  },
  {
    id: 'meal-4',
    date: TODAY_STR,
    meal_type: 'dinner',
    name: 'Maharashtrian Special Dinner',
    description: 'Puri Bhaji, Mixed Veg Kolhapuri, Steam Rice, Solkadhi & Fruit Custard.',
    items: ['Aloo Poori (4 pcs)', 'Veg Kolhapuri Curry', 'Steam Basmati Rice', 'Moong Dal Fry', 'Chilled Fruit Custard'],
    image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    mess_id: 'mess-1',
    open_time: '19:30',
    close_time: '21:30',
    expected_qty: 520,
    price: 0,
    status: 'published',
  },
  {
    id: 'meal-5',
    date: TOMORROW_STR,
    meal_type: 'lunch',
    name: 'Hyderabadi Veg Dum Biryani',
    description: 'Layered Basmati Rice Dum Biryani with Mirchi Ka Salan and Boondi Raita.',
    items: ['Hyderabadi Veg Biryani', 'Mirchi Ka Salan', 'Boondi Raita', 'Green Salad', 'Matka Phirni'],
    image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    mess_id: 'mess-1',
    open_time: '12:00',
    close_time: '14:30',
    expected_qty: 600,
    price: 0,
    status: 'published',
  }
];

export const MOCK_CHECKINS: Checkin[] = [
  { id: 'chk-1', student_id: 'student-1', meal_id: 'meal-1', checked_in_at: `${TODAY_STR}T08:14:22Z`, student_name: 'Aarav Sharma', hostel: 'Nilgiri Hall' },
  { id: 'chk-2', student_id: 'student-2', meal_id: 'meal-1', checked_in_at: `${TODAY_STR}T08:30:10Z`, student_name: 'Priya Ananth', hostel: 'Kaveri Hostel' },
  { id: 'chk-3', student_id: 'student-3', meal_id: 'meal-1', checked_in_at: `${TODAY_STR}T08:45:00Z`, student_name: 'Vikramaditya Roy', hostel: 'Vindhya Hall' },
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    student_id: 'student-1',
    meal_id: 'meal-1',
    stars: 5,
    quantity_feedback: 'just_right',
    taste_rating: 5,
    quality_rating: 5,
    temperature_rating: 4,
    variety_rating: 5,
    comment: 'The ghee dosa was crispy and fresh! Sambhar temperature was perfect.',
    created_at: `${TODAY_STR}T09:00:00Z`,
    student_name: 'Aarav Sharma',
    meal_name: 'South Indian Morning Feast'
  },
  {
    id: 'rev-2',
    student_id: 'student-2',
    meal_id: 'meal-1',
    stars: 4,
    quantity_feedback: 'just_right',
    taste_rating: 4,
    quality_rating: 4,
    temperature_rating: 5,
    variety_rating: 4,
    comment: 'Great idlis. Coconut chutney could use a touch more curry leaves.',
    created_at: `${TODAY_STR}T09:15:00Z`,
    student_name: 'Priya Ananth',
    meal_name: 'South Indian Morning Feast'
  }
];

export const MOCK_CONSUMPTION: Consumption[] = [
  {
    id: 'cons-1',
    meal_id: 'meal-1',
    prepared: 480,
    served: 432,
    remaining: 48,
    wasted: 12,
    redistributed: 36,
    created_at: `${TODAY_STR}T10:00:00Z`
  }
];

export const MOCK_SURPLUS: Surplus[] = [
  {
    id: 'surp-1',
    meal_id: 'meal-1',
    food: 'Idlis & Sambhar (Untouched Bulk Trays)',
    quantity: 36,
    prep_time: `${TODAY_STR}T07:00:00Z`,
    temperature: 'Hot (>65C)',
    storage_condition: 'Stainless Steel Insulated Container',
    packaging: 'Sealed Food-Grade Containers',
    pickup_deadline: `${TODAY_STR}T11:30:00Z`,
    location: 'Main Mess Dispatch Dock Gate 2',
    safety_verified: true,
    matched_recipient: 'Robin Hood Army - City Shelter 4',
    pickup_confirmed: true,
    created_at: `${TODAY_STR}T10:15:00Z`
  }
];

export const MOCK_FORECASTS: Forecast[] = [
  {
    meal_id: 'meal-2',
    date: TODAY_STR,
    meal_type: 'lunch',
    meal_name: 'Shahi North Indian Thali',
    mess_id: 'mess-1',
    expected_qty: 550,
    historical_attendance: 512,
    participation_rate: 93.1,
    predicted_demand: 508,
    recommended_prep_qty: 520
  },
  {
    meal_id: 'meal-3',
    date: TODAY_STR,
    meal_type: 'snacks',
    meal_name: 'Evening High Tea & Samosa',
    mess_id: 'mess-1',
    expected_qty: 400,
    historical_attendance: 340,
    participation_rate: 85.0,
    predicted_demand: 348,
    recommended_prep_qty: 360
  },
  {
    meal_id: 'meal-4',
    date: TODAY_STR,
    meal_type: 'dinner',
    meal_name: 'Maharashtrian Special Dinner',
    mess_id: 'mess-1',
    expected_qty: 520,
    historical_attendance: 468,
    participation_rate: 90.0,
    predicted_demand: 472,
    recommended_prep_qty: 485
  }
];
