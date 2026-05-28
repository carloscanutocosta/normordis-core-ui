import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from '@/hooks/use-mobile';

describe('useIsMobile', () => {
  let originalInnerWidth;

  beforeEach(() => {
    originalInnerWidth = window.innerWidth;
  });

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', { value: originalInnerWidth, configurable: true });
    vi.restoreAllMocks();
  });

  it('returns false on desktop viewport (>= 768px)', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('returns true on mobile viewport (< 768px)', () => {
    Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('returns false at exactly the mobile breakpoint (768px)', () => {
    Object.defineProperty(window, 'innerWidth', { value: 768, configurable: true });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('registers a matchMedia change listener on mount', () => {
    const mqlMock = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    vi.spyOn(window, 'matchMedia').mockReturnValue(mqlMock);
    renderHook(() => useIsMobile());
    expect(mqlMock.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('removes the change listener on unmount', () => {
    const mqlMock = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    vi.spyOn(window, 'matchMedia').mockReturnValue(mqlMock);
    const { unmount } = renderHook(() => useIsMobile());
    unmount();
    expect(mqlMock.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('updates when the matchMedia change event fires', () => {
    let capturedHandler;
    const mqlMock = {
      matches: false,
      addEventListener: vi.fn((_, fn) => {
        capturedHandler = fn;
      }),
      removeEventListener: vi.fn(),
    };
    vi.spyOn(window, 'matchMedia').mockReturnValue(mqlMock);
    Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    act(() => {
      Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true });
      capturedHandler();
    });
    expect(result.current).toBe(true);
  });
});
