import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { apiCall, getAccessToken, setTokens, clearTokens, ApiError } from '../api';

describe('API Library', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Token Management', () => {
    it('should store tokens correctly', () => {
      const accessToken = 'test-access-token';
      const refreshToken = 'test-refresh-token';
      
      setTokens(accessToken, refreshToken);
      
      expect(getAccessToken()).toBe(accessToken);
      expect(localStorage.getItem('refresh_token')).toBe(refreshToken);
    });

    it('should clear tokens', () => {
      setTokens('access', 'refresh');
      clearTokens();
      
      expect(getAccessToken()).toBeNull();
      expect(localStorage.getItem('refresh_token')).toBeNull();
    });
  });

  describe('ApiError', () => {
    it('should create error with status and message', () => {
      const error = new ApiError(400, 'Bad Request');
      
      expect(error.status).toBe(400);
      expect(error.message).toBe('Bad Request');
      expect(error.name).toBe('ApiError');
    });

    it('should create error with validation errors', () => {
      const errors = { email: ['Invalid email'], password: ['Too short'] };
      const error = new ApiError(422, 'Validation failed', errors);
      
      expect(error.errors).toEqual(errors);
    });
  });

  describe('apiCall', () => {
    beforeEach(() => {
      global.fetch = vi.fn();
    });

    it('should make successful API call', async () => {
      const mockData = { id: 1, name: 'Test' };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const result = await apiCall('/test');
      
      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('should include Authorization header when token exists', async () => {
      setTokens('test-token', 'refresh-token');
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      await apiCall('/protected');
      
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token',
          }),
        })
      );
    });

    it('should throw ApiError on failed request', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ message: 'Not found' }),
      });

      await expect(apiCall('/missing')).rejects.toThrow(ApiError);
    });

    it('should handle 204 No Content response', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 204,
      });

      const result = await apiCall('/delete', { method: 'DELETE' });
      
      expect(result).toEqual({});
    });
  });
});
