# FitTracker - Fitness Tracking Application

A comprehensive fitness tracking frontend application built with React, TypeScript, and Tailwind CSS. This application provides a complete interface for managing workouts, nutrition, goals, and daily steps.

## 🌟 Features

- **Authentication System**: Complete user authentication with login, registration, and token management
- **Dashboard**: Overview of all fitness metrics in one place
- **Workouts**: Track exercise sessions with duration, calories, and intensity
- **Goals**: Set and monitor fitness objectives with progress tracking
- **Meals**: Log nutrition information and track daily calorie intake
- **Steps**: Record daily step counts with detailed metrics
- **Profile Management**: Update user information and preferences

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set your API base URL:
```
VITE_API_BASE_URL=https://your-api-url.com
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## 🧪 Running Tests

Run the test suite:
```bash
npm run test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm run test:coverage
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Sidebar, DashboardLayout)
│   ├── ui/             # shadcn/ui components
│   └── ProtectedRoute.tsx
├── contexts/           # React contexts (AuthContext)
├── lib/               # Utilities and API clients
│   ├── api.ts         # Core API functions and validation
│   └── apiClient.ts   # API endpoint definitions
├── pages/             # Page components
│   ├── Auth.tsx       # Login/Registration
│   ├── Dashboard.tsx  # Main dashboard
│   ├── Workouts.tsx   # Workout management
│   ├── Goals.tsx      # Goal tracking
│   ├── Meals.tsx      # Nutrition logging
│   ├── Steps.tsx      # Step tracking
│   └── Profile.tsx    # User profile
└── test/              # Test utilities and setup
```

## 🎨 Design System

The application uses a custom design system with:
- **Primary Color**: Vibrant blue (#0080FF)
- **Secondary Color**: Green (#16A34A)
- **Accent Color**: Orange (#F97316)
- **Semantic tokens** for consistent theming
- **HSL color system** for easy customization

## 🔒 Authentication

The app implements JWT-based authentication with:
- Access token for API requests
- Refresh token for automatic token renewal
- Automatic redirect on token expiration
- Protected routes requiring authentication

## 📱 API Integration

All API endpoints from the Postman collection are integrated:

### Authentication
- POST `/api/auth/register/` - User registration
- POST `/api/auth/login/` - User login
- POST `/api/auth/token/refresh/` - Refresh access token
- POST `/api/auth/logout/` - User logout
- GET `/api/auth/profile/` - Get user profile
- PATCH `/api/auth/profile/` - Update user profile

### Workouts
- GET/POST `/api/workouts/workouts/` - List/Create workouts
- GET/PATCH/DELETE `/api/workouts/workouts/{id}/` - Manage specific workout
- GET `/api/workouts/workouts/today/` - Today's workouts
- GET `/api/workouts/workouts/this_week/` - This week's workouts
- GET `/api/workouts/workouts/summary/` - Workout summary
- POST `/api/workouts/workouts/{id}/start/` - Start workout
- POST `/api/workouts/workouts/{id}/complete/` - Complete workout
- POST `/api/workouts/workouts/{id}/skip/` - Skip workout

### Goals
- GET/POST `/api/workouts/goals/` - List/Create goals
- GET/PATCH/DELETE `/api/workouts/goals/{id}/` - Manage specific goal
- POST `/api/workouts/goals/{id}/update_progress/` - Update goal progress
- GET `/api/workouts/goals/summary/` - Goals summary

### Meals
- GET/POST `/api/meals/meals/` - List/Create meals
- GET/PATCH/DELETE `/api/meals/meals/{id}/` - Manage specific meal
- GET `/api/meals/meals/today/` - Today's meals
- GET `/api/meals/meals/summary/` - Meals summary

### Steps
- GET/POST `/api/steps/daily/` - List/Create daily steps
- GET/PATCH/DELETE `/api/steps/daily/{id}/` - Manage specific entry
- GET `/api/steps/daily/today/` - Today's steps
- POST `/api/steps/daily/quick_log/` - Quick log steps
- GET `/api/steps/daily/weekly/` - Weekly steps
- GET `/api/steps/daily/monthly/` - Monthly steps
- GET `/api/steps/daily/summary/` - Steps summary

## 🛡️ Input Validation

The application includes comprehensive input validation using Zod schemas:
- Email validation
- Password strength requirements
- Field length limits
- Data type validation
- Custom validation rules

## 🎯 Error Handling

- API errors with detailed messages
- Toast notifications for user feedback
- Loading states during API calls
- Graceful fallbacks for failed requests

## 📦 Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **TanStack Query** - Data fetching
- **Lucide React** - Icons
- **shadcn/ui** - UI components
- **Sonner** - Toast notifications
- **Vitest** - Testing framework

## 🔧 Configuration

### Environment Variables

- `VITE_API_BASE_URL` - Base URL for the API (required)

### Build Configuration

The project uses Vite for fast builds and hot module replacement. Configuration can be found in `vite.config.ts`.

## 📝 Development Guidelines

1. **Components**: Create small, focused components
2. **Styling**: Use design system tokens from `index.css`
3. **API Calls**: Use the `apiClient` functions
4. **Forms**: Use React Hook Form with Zod validation
5. **State**: Use React Context for global state
6. **Testing**: Write tests for critical functionality

## 🤝 Contributing

1. Follow the existing code style
2. Write tests for new features
3. Update documentation as needed
4. Use semantic commit messages

## 📄 License

This project is part of the FitTracker application.

## 🆘 Support

For issues or questions, please refer to the API documentation or contact the development team.
