import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { AdminSidebar } from './AdminSidebar';

// Mock useAuth
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ logout: vi.fn() }),
}));

describe('AdminSidebar', () => {
  it('renders the desktop sidebar', () => {
    const { container } = render(<AdminSidebar />);
    expect(container.querySelector('aside')).toBeTruthy();
  });

  it('renders navigation items', () => {
    const { container } = render(<AdminSidebar />);
    expect(container.textContent).toContain('Dashboard');
    expect(container.textContent).toContain('Projects');
    expect(container.textContent).toContain('Blogs');
    expect(container.textContent).toContain('Experience');
    expect(container.textContent).toContain('Skills');
    expect(container.textContent).toContain('Site Content');
  });

  it('renders logout button', () => {
    const { container } = render(<AdminSidebar />);
    expect(container.textContent).toContain('Logout');
  });

  it('renders mobile header with menu button', () => {
    const { container } = render(<AdminSidebar />);
    const menuBtn = container.querySelector('button[aria-label="Open navigation menu"]');
    expect(menuBtn).toBeTruthy();
  });
});
