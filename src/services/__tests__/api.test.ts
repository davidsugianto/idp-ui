import { describe, it, expect } from 'vitest';
import api from '../api';

type AxiosResponseInterceptor = {
  fulfilled: (value: unknown) => unknown;
};

describe('API client interceptors', () => {
  describe('response interceptor', () => {
    it('returns response on success', () => {
      const response = { data: 'ok', status: 200 };
      const interceptor = ((api.interceptors.response as unknown as { handlers: AxiosResponseInterceptor[] }).handlers[0]);

      const result = interceptor.fulfilled(response);

      expect(result).toEqual(response);
    });
  });
});
