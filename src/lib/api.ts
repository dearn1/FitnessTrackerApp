import { z } from 'zod';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://vercel.com/endra-sims-projects/fitness-tracker-app-backend';

// Token storage
const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const getAccessToken = () => localStorage.getItem(TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
export const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};
export const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// API Error class
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Refresh token logic
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new ApiError(401, 'No refresh token available');
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!response.ok) {
    clearTokens();
    throw new ApiError(401, 'Token refresh failed');
  }

  const data = await response.json();
  setTokens(data.access, refreshToken);
  return data.access;
};

// Generic API call function
export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAccessToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token && !endpoint.includes('/auth/register') && !endpoint.includes('/auth/login')) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 with token refresh
  if (response.status === 401 && token) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const newToken = await refreshAccessToken();
        isRefreshing = false;
        onTokenRefreshed(newToken);

        // Retry original request with new token
        headers['Authorization'] = `Bearer ${newToken}`;
        response = await fetch(url, {
          ...options,
          headers,
        });
      } catch (error) {
        isRefreshing = false;
        clearTokens();
        window.location.href = '/auth';
        throw error;
      }
    } else {
      // Wait for token refresh
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((newToken: string) => {
          headers['Authorization'] = `Bearer ${newToken}`;
          fetch(url, {
            ...options,
            headers,
          })
            .then(res => {
              if (!res.ok) {
                return res.json().then(err => {
                  throw new ApiError(res.status, err.message || 'Request failed', err);
                });
              }
              return res.json();
            })
            .then(resolve)
            .catch(reject);
        });
      });
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new ApiError(
      response.status,
      errorData.message || errorData.detail || 'Request failed',
      errorData.errors
    );
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// Validation schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email address').max(255),
  username: z.string().min(3, 'Username must be at least 3 characters').max(150),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
  password2: z.string(),
  first_name: z.string().min(1, 'First name is required').max(150),
  last_name: z.string().min(1, 'Last name is required').max(150),
}).refine(data => data.password === data.password2, {
  message: "Passwords don't match",
  path: ['password2'],
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const workoutSchema = z.object({
  workout_type: z.string().min(1, 'Workout type is required'),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  calories_burned: z.number().min(0),
  distance: z.number().min(0).optional(),
  intensity: z.enum(['low', 'medium', 'high']),
  status: z.enum(['planned', 'in_progress', 'completed', 'skipped']),
  workout_date: z.string(),
});

export const goalSchema = z.object({
  goal_type: z.string().min(1, 'Goal type is required'),
  title: z.string().min(1, 'Title is required').max(200),
  target_value: z.number().min(0),
  current_value: z.number().min(0).optional(),
  start_date: z.string(),
  end_date: z.string(),
});

export const mealSchema = z.object({
  meal_type: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  name: z.string().min(1, 'Meal name is required').max(200),
  meal_date: z.string(),
  meal_time: z.string(),
  calories: z.number().min(0),
  protein: z.number().min(0),
  carbs: z.number().min(0),
  fats: z.number().min(0),
});

export const stepsSchema = z.object({
  date: z.string(),
  steps: z.number().min(0),
  distance_km: z.number().min(0).optional(),
  calories_burned: z.number().min(0).optional(),
  active_minutes: z.number().min(0).optional(),
  source: z.enum(['manual', 'device', 'app']).optional(),
});
