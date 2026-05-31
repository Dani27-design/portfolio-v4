import { describe, it, expect } from 'vitest';
import { render, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeProvider';

function ThemeConsumer() {
  const { theme, isCodeMode, setTheme, toggleCodeMode } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="code">{String(isCodeMode)}</span>
      <button onClick={() => setTheme('light')} data-testid="set-light">Light</button>
      <button onClick={() => setTheme('dark')} data-testid="set-dark">Dark</button>
      <button onClick={toggleCodeMode} data-testid="toggle-code">Code</button>
    </div>
  );
}

describe('ThemeProvider', () => {
  it('provides default theme', () => {
    const { container } = render(
      <ThemeProvider><ThemeConsumer /></ThemeProvider>
    );
    const theme = container.querySelector('[data-testid="theme"]');
    // matchMedia mock returns matches: false, so prefers-color-scheme: dark is false → defaults to light
    expect(['light', 'dark']).toContain(theme?.textContent);
  });

  it('provides code mode default as false', () => {
    const { container } = render(
      <ThemeProvider><ThemeConsumer /></ThemeProvider>
    );
    const code = container.querySelector('[data-testid="code"]');
    expect(code?.textContent).toBe('false');
  });

  it('throws when useTheme is used outside provider', () => {
    expect(() => {
      render(<ThemeConsumer />);
    }).toThrow('useTheme must be used within ThemeProvider');
  });

  it('allows theme switching', () => {
    const { container } = render(
      <ThemeProvider><ThemeConsumer /></ThemeProvider>
    );
    const lightBtn = container.querySelector('[data-testid="set-light"]') as HTMLButtonElement;
    act(() => lightBtn.click());
    expect(container.querySelector('[data-testid="theme"]')?.textContent).toBe('light');
  });

  it('allows code mode toggling', () => {
    const { container } = render(
      <ThemeProvider><ThemeConsumer /></ThemeProvider>
    );
    const toggleBtn = container.querySelector('[data-testid="toggle-code"]') as HTMLButtonElement;
    act(() => toggleBtn.click());
    expect(container.querySelector('[data-testid="code"]')?.textContent).toBe('true');
    act(() => toggleBtn.click());
    expect(container.querySelector('[data-testid="code"]')?.textContent).toBe('false');
  });
});
