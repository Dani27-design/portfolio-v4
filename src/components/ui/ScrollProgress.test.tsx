import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ScrollProgress } from './ScrollProgress';

describe('ScrollProgress', () => {
  it('renders a fixed progress bar', () => {
    const { container } = render(<ScrollProgress />);
    const bar = container.firstElementChild as HTMLElement;
    expect(bar).toBeTruthy();
    expect(bar.classList.contains('fixed')).toBe(true);
  });

  it('has aria-hidden attribute', () => {
    const { container } = render(<ScrollProgress />);
    const bar = container.firstElementChild as HTMLElement;
    expect(bar.getAttribute('aria-hidden')).toBe('true');
  });
});
