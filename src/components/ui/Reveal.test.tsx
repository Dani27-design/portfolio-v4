import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Reveal } from './Reveal';

describe('Reveal', () => {
  it('renders children', () => {
    const { container } = render(<Reveal><span>Content</span></Reveal>);
    expect(container.textContent).toBe('Content');
  });

  it('wraps content in a motion div', () => {
    const { container } = render(<Reveal><span>Test</span></Reveal>);
    // motion.div renders a plain div in test env
    expect(container.querySelector('div')).toBeTruthy();
  });

  it('applies width style', () => {
    const { container } = render(<Reveal width="100%"><span>Full</span></Reveal>);
    const div = container.firstElementChild as HTMLElement;
    expect(div.style.width).toBe('100%');
  });

  it('applies custom className', () => {
    const { container } = render(<Reveal className="custom-class"><span>Test</span></Reveal>);
    expect(container.querySelector('.custom-class')).toBeTruthy();
  });
});
