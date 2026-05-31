import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@/context/ThemeProvider';
import { CodeText } from './CodeText';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('CodeText', () => {
  it('renders children as plain text when code mode is off', () => {
    const { container } = render(<CodeText>Hello</CodeText>, { wrapper: Wrapper });
    expect(container.textContent).toBe('Hello');
  });

  it('renders children text content', () => {
    const { container } = render(<CodeText type="html" tag="h1">Title</CodeText>, { wrapper: Wrapper });
    expect(container.textContent).toContain('Title');
  });

  it('applies custom className', () => {
    const { container } = render(<CodeText className="text-red-500">Text</CodeText>, { wrapper: Wrapper });
    const span = container.querySelector('.text-red-500');
    expect(span).toBeTruthy();
  });

  it('renders with different types', () => {
    const types: Array<'html' | 'css' | 'js' | 'logic'> = ['html', 'css', 'js', 'logic'];
    for (const type of types) {
      const { container } = render(<CodeText type={type}>Content</CodeText>, { wrapper: Wrapper });
      expect(container.textContent).toContain('Content');
    }
  });
});
