import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@/context/ThemeProvider';
import { Skills } from './Skills';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

async function renderAsync(component: Promise<React.JSX.Element | null>) {
  const jsx = await component;
  if (!jsx) return render(<div />, { wrapper: Wrapper });
  return render(jsx, { wrapper: Wrapper });
}

const mockSkills = [
  {
    id: '1',
    title: { en: 'Core', id: 'Inti' },
    context: { en: 'Building systems', id: 'Membangun' },
    skills: [{ name: 'TypeScript', tag: 'STRICT' }],
    order: 1,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

describe('Skills', () => {
  it('renders skills section with data', async () => {
    const { container } = await renderAsync(Skills({ skills: mockSkills, locale: 'en' }));
    expect(container.querySelector('#skills')).toBeTruthy();
    expect(container.textContent).toContain('TypeScript');
  });

  it('returns null for empty data', async () => {
    const result = await Skills({ skills: [], locale: 'en' });
    expect(result).toBeNull();
  });

  it('renders skill tags', async () => {
    const { container } = await renderAsync(Skills({ skills: mockSkills, locale: 'en' }));
    expect(container.textContent).toContain('STRICT');
  });
});
