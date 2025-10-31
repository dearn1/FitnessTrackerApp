import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';
import { AuthProvider } from '@/contexts/AuthContext';

// Mock the useAuth hook
vi.mock('@/contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useAuth: vi.fn(),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>{component}</AuthProvider>
    </BrowserRouter>
  );
};

describe('ProtectedRoute', () => {
  it('should render loading state while checking authentication', () => {
    const { useAuth } = require('@/contexts/AuthContext');
    useAuth.mockReturnValue({
      isAuthenticated: false,
      loading: true,
    });

    const { getByText } = renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(getByText('Loading...')).toBeDefined();
  });

  it('should render children when authenticated', () => {
    const { useAuth } = require('@/contexts/AuthContext');
    useAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
    });

    const { getByText } = renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(getByText('Protected Content')).toBeDefined();
  });
});
