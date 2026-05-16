import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@/context/ThemeProvider';

interface AllProvidersProps {
  children: React.ReactNode;
}

/**
 * Default wrapper with ThemeProvider for standard tests.
 * next-intl and next/navigation are mocked globally in setup.ts.
 */
const AllProviders: React.FC<AllProvidersProps> = ({ children }) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};

/**
 * Custom render with all providers
 */
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options });

// Re-export everything from testing-library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

// Export custom render
export { customRender as render };
