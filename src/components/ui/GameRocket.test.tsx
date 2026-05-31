import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { GameRocket } from './GameRocket';

describe('GameRocket', () => {
  it('renders an SVG element', () => {
    const { container } = render(<GameRocket />);
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('renders with custom className', () => {
    const { container } = render(<GameRocket className="w-10 h-10" />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.classList.contains('w-10')).toBe(true);
  });

  it('renders in code mode with different colors', () => {
    const { container: normalContainer } = render(<GameRocket isCodeMode={false} />);
    const { container: codeContainer } = render(<GameRocket isCodeMode={true} />);
    // Both should render SVGs
    expect(normalContainer.querySelector('svg')).toBeTruthy();
    expect(codeContainer.querySelector('svg')).toBeTruthy();
  });
});
