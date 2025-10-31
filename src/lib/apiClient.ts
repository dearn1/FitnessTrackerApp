import { apiCall } from './api';

export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface Workout {
  id: number;
  workout_type: string;
  title: string;
  description?: string;
  duration: number;
  calories_burned: number;
  distance?: number;
  intensity: 'low' | 'medium' | 'high';
  status: 'planned' | 'in_progress' | 'completed' | 'skipped';
  workout_date: string;
  created_at: string;
  updated_at: string;
}

export interface Goal {
  id: number;
  goal_type: string;
  title: string;
  target_value: number;
  current_value: number;
  start_date: string;
  end_date: string;
  is_completed: boolean;
  completion_percentage: number;
  created_at: string;
}

export interface Meal {
  id: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  meal_date: string;
  meal_time: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  created_at: string;
}

export interface DailySteps {
  id: number;
  date: string;
  steps: number;
  distance_km?: number;
  calories_burned?: number;
  active_minutes?: number;
  source?: 'manual' | 'device' | 'app';
  created_at: string;
}

// Authentication
export const authApi = {
  register: (data: {
    email: string;
    username: string;
    password: string;
    password2: string;
    first_name: string;
    last_name: string;
  }) => apiCall<AuthResponse>('/api/auth/register/', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    apiCall<AuthResponse>('/api/auth/login/', { method: 'POST', body: JSON.stringify(data) }),

  logout: (refreshToken: string) =>
    apiCall('/api/auth/logout/', { method: 'POST', body: JSON.stringify({ refresh_token: refreshToken }) }),

  getProfile: () => apiCall<User>('/api/auth/profile/'),

  updateProfile: (data: Partial<User>) =>
    apiCall<User>('/api/auth/profile/', { method: 'PATCH', body: JSON.stringify(data) }),
};

// Workouts
export const workoutsApi = {
  list: () => apiCall<Workout[]>('/api/workouts/workouts/'),
  
  create: (data: Omit<Workout, 'id' | 'created_at' | 'updated_at'>) =>
    apiCall<Workout>('/api/workouts/workouts/', { method: 'POST', body: JSON.stringify(data) }),
  
  get: (id: number) => apiCall<Workout>(`/api/workouts/workouts/${id}/`),
  
  update: (id: number, data: Partial<Workout>) =>
    apiCall<Workout>(`/api/workouts/workouts/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  
  delete: (id: number) => apiCall(`/api/workouts/workouts/${id}/`, { method: 'DELETE' }),
  
  today: () => apiCall<Workout[]>('/api/workouts/workouts/today/'),
  
  thisWeek: () => apiCall<Workout[]>('/api/workouts/workouts/this_week/'),
  
  summary: () => apiCall<any>('/api/workouts/workouts/summary/'),
  
  start: (id: number) => apiCall(`/api/workouts/workouts/${id}/start/`, { method: 'POST', body: '{}' }),
  
  complete: (id: number, data: { duration: number; calories_burned: number }) =>
    apiCall(`/api/workouts/workouts/${id}/complete/`, { method: 'POST', body: JSON.stringify(data) }),
  
  skip: (id: number) => apiCall(`/api/workouts/workouts/${id}/skip/`, { method: 'POST', body: '{}' }),
};

// Goals
export const goalsApi = {
  list: () => apiCall<Goal[]>('/api/workouts/goals/'),
  
  create: (data: Omit<Goal, 'id' | 'is_completed' | 'completion_percentage' | 'created_at' | 'current_value'>) =>
    apiCall<Goal>('/api/workouts/goals/', { method: 'POST', body: JSON.stringify(data) }),
  
  get: (id: number) => apiCall<Goal>(`/api/workouts/goals/${id}/`),
  
  update: (id: number, data: Partial<Goal>) =>
    apiCall<Goal>(`/api/workouts/goals/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  
  delete: (id: number) => apiCall(`/api/workouts/goals/${id}/`, { method: 'DELETE' }),
  
  updateProgress: (id: number, increment: number) =>
    apiCall(`/api/workouts/goals/${id}/update_progress/`, { 
      method: 'POST', 
      body: JSON.stringify({ increment_by: increment }) 
    }),
  
  summary: () => apiCall<any>('/api/workouts/goals/summary/'),
};

// Meals
export const mealsApi = {
  list: () => apiCall<Meal[]>('/api/meals/meals/'),
  
  create: (data: Omit<Meal, 'id' | 'created_at'>) =>
    apiCall<Meal>('/api/meals/meals/', { method: 'POST', body: JSON.stringify(data) }),
  
  get: (id: number) => apiCall<Meal>(`/api/meals/meals/${id}/`),
  
  update: (id: number, data: Partial<Meal>) =>
    apiCall<Meal>(`/api/meals/meals/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  
  delete: (id: number) => apiCall(`/api/meals/meals/${id}/`, { method: 'DELETE' }),
  
  today: () => apiCall<Meal[]>('/api/meals/meals/today/'),
  
  summary: () => apiCall<any>('/api/meals/meals/summary/'),
};

// Steps
export const stepsApi = {
  list: () => apiCall<DailySteps[]>('/api/steps/daily/'),
  
  create: (data: Omit<DailySteps, 'id' | 'created_at'>) =>
    apiCall<DailySteps>('/api/steps/daily/', { method: 'POST', body: JSON.stringify(data) }),
  
  get: (id: number) => apiCall<DailySteps>(`/api/steps/daily/${id}/`),
  
  update: (id: number, data: Partial<DailySteps>) =>
    apiCall<DailySteps>(`/api/steps/daily/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  
  delete: (id: number) => apiCall(`/api/steps/daily/${id}/`, { method: 'DELETE' }),
  
  today: () => apiCall<DailySteps>('/api/steps/daily/today/'),
  
  quickLog: (steps: number) =>
    apiCall<DailySteps>('/api/steps/daily/quick_log/', { method: 'POST', body: JSON.stringify({ steps }) }),
  
  weekly: () => apiCall<DailySteps[]>('/api/steps/daily/weekly/'),
  
  monthly: () => apiCall<DailySteps[]>('/api/steps/daily/monthly/'),
  
  summary: () => apiCall<any>('/api/steps/daily/summary/'),
  
  chartData: (period: number = 7) => apiCall<any>(`/api/steps/daily/chart_data/?period=${period}`),
};
