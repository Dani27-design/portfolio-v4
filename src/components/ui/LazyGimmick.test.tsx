import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { LazyGimmick } from './LazyGimmick';

describe('LazyGimmick', () => {
  it('renders the sentinel element with aria-hidden', () => {
    const { container } = render(
      <div style={{ position: 'relative' }}>
        <LazyGimmick><div data-testid="gimmick">Gimmick</div></LazyGimmick>
      </div>
    );
    const sentinel = container.querySelector('[aria-hidden="true"]');
    expect(sentinel).toBeTruthy();
  });

  it('does not render children when not visible (default state)', () => {
    const { container } = render(
      <div style={{ position: 'relative' }}>
        <LazyGimmick><div data-gimmick>Gimmick</div></LazyGimmick>
      </div>
    );
    // Children not rendered until IntersectionObserver fires
    expect(container.querySelector('[data-gimmick]')).toBeNull();
  });
});
