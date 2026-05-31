import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { CustomCursor } from './CustomCursor';

describe('CustomCursor', () => {
  it('renders cursor elements', () => {
    const { container } = render(<CustomCursor />);
    expect(container.querySelector('#cursor')).toBeTruthy();
    expect(container.querySelector('#cursor-follower')).toBeTruthy();
  });

  it('marks cursor elements as aria-hidden', () => {
    const { container } = render(<CustomCursor />);
    expect(container.querySelector('#cursor')?.getAttribute('aria-hidden')).toBe('true');
    expect(container.querySelector('#cursor-follower')?.getAttribute('aria-hidden')).toBe('true');
  });
});
