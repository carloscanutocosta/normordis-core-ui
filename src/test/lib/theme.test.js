import { describe, it, expect, beforeEach } from 'vitest';
import { THEMES, applyTheme, getStoredTheme } from '@/lib/theme';

beforeEach(() => {
  document.documentElement.className = '';
  localStorage.clear();
});

describe('THEMES', () => {
  it('exports an array with at least one theme', () => {
    expect(Array.isArray(THEMES)).toBe(true);
    expect(THEMES.length).toBeGreaterThan(0);
  });

  it('each theme has id, label and icon', () => {
    THEMES.forEach(t => {
      expect(t).toHaveProperty('id');
      expect(t).toHaveProperty('label');
      expect(t).toHaveProperty('icon');
    });
  });

  it('includes light and dark themes', () => {
    const ids = THEMES.map(t => t.id);
    expect(ids).toContain('light');
    expect(ids).toContain('dark');
  });
});

describe('applyTheme', () => {
  it('adds the dark class when theme is dark', () => {
    applyTheme('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('adds high-contrast class when theme is high-contrast', () => {
    applyTheme('high-contrast');
    expect(document.documentElement.classList.contains('high-contrast')).toBe(true);
  });

  it('removes all theme classes when theme is light', () => {
    document.documentElement.classList.add('dark', 'high-contrast');
    applyTheme('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(document.documentElement.classList.contains('high-contrast')).toBe(false);
  });

  it('removes previous theme class when switching themes', () => {
    applyTheme('dark');
    applyTheme('high-contrast');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(document.documentElement.classList.contains('high-contrast')).toBe(true);
  });

  it('persists the theme id to localStorage', () => {
    applyTheme('dark');
    expect(localStorage.getItem('app-theme')).toBe('dark');
  });

  it('persists light theme to localStorage', () => {
    applyTheme('light');
    expect(localStorage.getItem('app-theme')).toBe('light');
  });
});

describe('getStoredTheme', () => {
  it('returns light when nothing is stored', () => {
    expect(getStoredTheme()).toBe('light');
  });

  it('returns the stored theme id', () => {
    localStorage.setItem('app-theme', 'dark');
    expect(getStoredTheme()).toBe('dark');
  });

  it('returns high-contrast-dark when stored', () => {
    localStorage.setItem('app-theme', 'high-contrast-dark');
    expect(getStoredTheme()).toBe('high-contrast-dark');
  });
});
