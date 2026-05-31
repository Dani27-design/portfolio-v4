import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SkipGameLink } from './SkipGameLink';

describe('SkipGameLink', () => {
  it('renders a skip link pointing to #work', () => {
    const { container } = render(<SkipGameLink />);
    const link = container.querySelector('a[href="#work"]');
    expect(link).toBeTruthy();
  });

  it('has sr-only class for screen reader accessibility', () => {
    const { container } = render(<SkipGameLink />);
    const link = container.querySelector('a');
    expect(link?.classList.contains('sr-only')).toBe(true);
  });
});
