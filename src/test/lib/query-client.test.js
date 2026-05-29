import { describe, it, expect } from 'vitest';
import { queryClientInstance } from '@/lib/query-client';

describe('queryClientInstance', () => {
  it('is defined', () => {
    expect(queryClientInstance).toBeDefined();
  });

  it('has refetchOnWindowFocus disabled', () => {
    const defaults = queryClientInstance.getDefaultOptions();
    expect(defaults.queries?.refetchOnWindowFocus).toBe(false);
  });
});
