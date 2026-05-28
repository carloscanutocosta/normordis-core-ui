import { describe, it, expect } from 'vitest';
import { cn, isBrowser } from '@/lib/utils';

describe('cn — class name merger', () => {
  it('merges multiple class strings', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('filters out falsy values', () => {
    expect(cn('foo', false && 'bar', null, undefined)).toBe('foo');
  });

  it('deduplicates conflicting Tailwind classes (last wins)', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
    expect(cn('text-sm', 'text-lg')).toBe('text-lg');
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
  });

  it('handles object syntax', () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz');
  });

  it('handles array syntax', () => {
    expect(cn(['a', 'b', 'c'])).toBe('a b c');
  });

  it('handles mixed object and string inputs', () => {
    expect(cn('base', { active: true, disabled: false }, 'extra')).toBe('base active extra');
  });

  it('returns an empty string when all inputs are falsy', () => {
    expect(cn(false, null, undefined)).toBe('');
  });

  it('merges conditional classes correctly', () => {
    const isActive = true;
    const isDisabled = false;
    expect(cn('btn', isActive && 'btn-active', isDisabled && 'btn-disabled')).toBe(
      'btn btn-active',
    );
  });
});

describe('isBrowser', () => {
  it('is true in the jsdom test environment', () => {
    expect(isBrowser).toBe(true);
  });
});
