import { Mess, Meal, Checkin, Review, Consumption, Surplus, Forecast, Profile } from '../types';

export const TODAY_STR = new Date().toISOString().split('T')[0];
export const TOMORROW_STR = new Date(Date.now() + 86400000).toISOString().split('T')[0];

export const MOCK_MESSES: Mess[] = [
  { id: 'mess-1', name: 'ITER LH1 & LH4 Mess Complex', location: 'LH1 & LH4 Complex', capacity: 700 },
  { id: 'mess-2', name: 'ITER LH2, LH3 & LH5 Mess Complex', location: 'LH2, LH3 & LH5 Quad', capacity: 950 },
];

export const MOCK_PROFILES: Profile[] = [
  { id: 'student-1', role: 'student', name: 'Ananya Sahu', student_id: '24ITERLH1042', hostel: 'LH1', block: 'Rm 204', dietary_pref: 'Vegetarian' },
  { id: 'student-2', role: 'student', name: 'Priya Dash', student_id: '23ITERLH2089', hostel: 'LH2', block: 'Rm 112', dietary_pref: 'Non-Vegetarian' },
  { id: 'student-3', role: 'student', name: 'Shruti Mohanty', student_id: '24ITERLH3015', hostel: 'LH3', block: 'Rm 305', dietary_pref: 'Vegetarian' },
  { id: 'student-4', role: 'student', name: 'Deepika Nayak', student_id: '23ITERLH4091', hostel: 'LH4', block: 'Rm 108', dietary_pref: 'Non-Vegetarian' },
  { id: 'student-5', role: 'student', name: 'Sneha Pattnaik', student_id: '24ITERLH5066', hostel: 'LH5', block: 'Rm 402', dietary_pref: 'Vegetarian' },
  { id: 'authority-1', role: 'authority', name: 'Warden Office', hostel: 'LH1 to LH5', block: 'Directorate' }
];

export const MOCK_MEALS: Meal[] = [
  {
    id: 'meal-1',
    date: TODAY_STR,
    meal_type: 'breakfast',
    name: 'Idli, Sambar & Coconut Chutney',
    description: 'ITER LH Winter Menu (Week-1 Monday Breakfast): Fresh Idli with authentic Sambar and Coconut Chutney.',
    items: ['Idli (4 Pcs)', 'Sambar', 'Coconut Chutney', 'Coffee / Tea'],
    image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    mess_id: 'mess-1',
    open_time: '07:30',
    close_time: '09:30',
    expected_qty: 650,
    price: 0,
    status: 'closed',
  },
  {
    id: 'meal-2',
    date: TODAY_STR,
    meal_type: 'lunch',
    name: 'Rice, Dal & Veg Besara Thali',
    description: 'ITER LH Winter Menu (Week-1 Monday Lunch): Common Rice, Roti, Dal, Veg Besara, Jeera Aloo, Dahi Boondi.',
    items: ['Common: Rice (Arua & Usuna)', 'Roti', 'Dal', 'Veg Curry: Veg Besara', 'Side Items: Jeera Aloo', 'Dahi Boondi'],
    image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    mess_id: 'mess-1',
    open_time: '12:00',
    close_time: '14:30',
    expected_qty: 850,
    price: 0,
    status: 'open',
  },
  {
    id: 'meal-3',
    date: TODAY_STR,
    meal_type: 'snacks',
    name: 'Samosa & Imli Chutney High Tea',
    description: 'ITER LH Winter Menu (Week-1 Monday Snacks): Big Crispy Samosas with Tangy Imli Chutney and Coffee.',
    items: ['Samosa (Big 2 Pcs)', 'Imli Chutney', 'Hot Coffee / Tea'],
    image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    mess_id: 'mess-1',
    open_time: '16:30',
    close_time: '17:45',
    expected_qty: 700,
    price: 0,
    status: 'published',
  },
  {
    id: 'meal-4',
    date: TODAY_STR,
    meal_type: 'dinner',
    name: 'Rice, Dal, Chole Aloo & Rasgulla',
    description: 'ITER LH Winter Menu (Week-1 Monday Dinner): Common Rice, Roti, Dal, Chole Aloo, Jhudanga Bhaja & Rasgulla.',
    items: ['Common: Rice (Arua & Usuna)', 'Roti', 'Dal', 'Veg Curry: Chole Aloo', 'Side Items: Aloo Cluster Beans / Jhudanga Bhaja', 'Dessert: Rasgulla (1 Pc)'],
    image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    mess_id: 'mess-1',
    open_time: '19:30',
    close_time: '21:30',
    expected_qty: 800,
    price: 0,
    status: 'published',
  },
  {
    id: 'meal-5',
    date: TOMORROW_STR,
    meal_type: 'breakfast',
    name: 'Poha with Mungfali & Ghuguni',
    description: 'ITER LH Winter Menu (Tuesday Breakfast): Poha with Mungfali, Hot Ghuguni & Tea.',
    items: ['Poha (With Mungfali)', 'Ghuguni', 'Hot Tea'],
    image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    mess_id: 'mess-1',
    open_time: '07:30',
    close_time: '09:30',
    expected_qty: 680,
    price: 0,
    status: 'published',
  },
  {
    id: 'meal-6',
    date: TOMORROW_STR,
    meal_type: 'lunch',
    name: 'Mushroom Besara & Fish Bessara Thali',
    description: 'ITER LH Winter Menu (Tuesday Lunch): Common Rice, Roti, Dal, Mushroom Besara with Ambula / Fish Bessara.',
    items: ['Common: Rice (Arua & Usuna)', 'Roti', 'Dal', 'Veg Curry: Mushroom Besara with Ambula', 'Non-Veg Curry: Fish Bessara', 'Side Items: Aloo Beans Bhaja'],
    image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    mess_id: 'mess-1',
    open_time: '12:00',
    close_time: '14:30',
    expected_qty: 880,
    price: 0,
    status: 'published',
  },
  {
    id: 'meal-7',
    date: TOMORROW_STR,
    meal_type: 'snacks',
    name: 'Italian Pasta & Tea',
    description: 'ITER LH Winter Menu (Tuesday Snacks): Delicious Pasta with Hot Tea.',
    items: ['Hot Italian Pasta', 'Hot Tea'],
    image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    mess_id: 'mess-1',
    open_time: '16:30',
    close_time: '17:45',
    expected_qty: 720,
    price: 0,
    status: 'published',
  },
  {
    id: 'meal-8',
    date: TOMORROW_STR,
    meal_type: 'dinner',
    name: 'Paneer Bhurji & Egg Bhurji Feast',
    description: 'ITER LH Winter Menu (Tuesday Dinner): Common Rice, Roti, Dal, Paneer Bhurji / Egg Bhurji, Crispy Alu Bhindi.',
    items: ['Common: Rice (Arua & Usuna)', 'Roti', 'Dal', 'Veg Curry: Paneer Bhurji', 'Non-Veg Curry: Egg Bhurji', 'Side Items: Crispy Alu Bhindi', 'Fresh Salad'],
    image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    mess_id: 'mess-1',
    open_time: '19:30',
    close_time: '21:30',
    expected_qty: 820,
    price: 0,
    status: 'published',
  }
];

export const MOCK_CHECKINS: Checkin[] = [
  { id: 'chk-1', student_id: 'student-1', meal_id: 'meal-1', checked_in_at: `${TODAY_STR}T08:14:22Z`, student_name: 'Ananya Sahu', hostel: 'LH-1 (Ladies Hostel 1)' },
  { id: 'chk-2', student_id: 'student-2', meal_id: 'meal-1', checked_in_at: `${TODAY_STR}T08:30:10Z`, student_name: 'Priya Dash', hostel: 'LH-2 (Ladies Hostel 2)' },
  { id: 'chk-3', student_id: 'student-3', meal_id: 'meal-1', checked_in_at: `${TODAY_STR}T08:45:00Z`, student_name: 'Shruti Mohanty', hostel: 'LH-3 (Ladies Hostel 3)' },
];

export const MOCK_REVIEWS: Review[] = [
  { id: 'rev-1', student_id: 'student-1', student_name: 'Ananya Sahu', meal_id: 'meal-1', rating: 5, comment: 'Authentic Idli & Sambar! Loved the coconut chutney.', created_at: `${TODAY_STR}T09:10:00Z` },
  { id: 'rev-2', student_id: 'student-2', student_name: 'Priya Dash', meal_id: 'meal-1', rating: 4, comment: 'Good quantity and served hot at LH-2 mess.', created_at: `${TODAY_STR}T09:20:00Z` }
];

export const MOCK_FORECASTS: ForecastItem[] = [
  { date: TODAY_STR, meal_type: 'lunch', expected_headcount: 850, predicted_waste_kg: 12, recommended_prep_qty: 838 },
  { date: TOMORROW_STR, meal_type: 'lunch', expected_headcount: 880, predicted_waste_kg: 14, recommended_prep_qty: 866 }
];
