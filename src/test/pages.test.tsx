import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/context/ThemeProvider';
import { About } from '@/components/sections/About';
import { Contact } from '@/components/sections/Contact';
import { Skills } from '@/components/sections/Skills';
import { Experience } from '@/components/sections/Experience';
import { Projects } from '@/components/sections/Projects';
import { Blog } from '@/components/sections/Blog';
import type { SkillGroup, ExperienceItem, Project, Blog as BlogType } from '@/types';

const mockSkills: SkillGroup[] = [
  {
    id: '1',
    title: { en: 'Core Engineering', id: 'Rekayasa Inti' },
    context: { en: 'Building scalable systems', id: 'Membangun sistem skalabel' },
    skills: [
      { name: 'TypeScript', tag: 'STRICT' },
      { name: 'Node.js', tag: 'RUNTIME' },
    ],
    order: 1,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

const mockExperience: ExperienceItem[] = [
  {
    id: '1',
    title: { en: 'Senior Engineer', id: 'Insinyur Senior' },
    company: 'TestCo',
    period: { en: 'Jan 2022 — Present', id: 'Jan 2022 — Sekarang' },
    points: { en: ['Built systems', 'Led team'], id: ['Membangun sistem', 'Memimpin tim'] },
    isCurrent: true,
    order: 1,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

const mockProjects: Project[] = [
  {
    id: '1',
    slug: 'test-project',
    name: { en: 'Test Project', id: 'Proyek Uji' },
    desc: { en: 'A test project', id: 'Proyek pengujian' },
    tech: ['TypeScript', 'React'],
    version: 'v1.0.0',
    status: 'PRODUCTION',
    order: 1,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

const mockBlogs: BlogType[] = [
  {
    id: '1',
    slug: 'test-blog',
    title: { en: 'Test Blog', id: 'Blog Uji' },
    excerpt: { en: 'A test excerpt', id: 'Kutipan uji' },
    content: '# Hello World',
    date: '2024-01-01',
    order: 1,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('Section Components Rendering', () => {
  it('About renders without crashing', () => {
    const { container } = render(<About />, { wrapper: Wrapper });
    expect(container.querySelector('#about')).toBeDefined();
  });

  it('Contact renders without crashing', () => {
    const { container } = render(<Contact />, { wrapper: Wrapper });
    expect(container.querySelector('#contact')).toBeDefined();
  });

  it('Skills renders with data', () => {
    const { container } = render(<Skills skills={mockSkills} locale="en" />, { wrapper: Wrapper });
    expect(container.querySelector('#skills')).toBeDefined();
  });

  it('Experience renders with data', () => {
    const { container } = render(<Experience experience={mockExperience} locale="en" />, { wrapper: Wrapper });
    expect(container.querySelector('#work')).toBeDefined();
  });

  it('Projects renders with data', () => {
    const { container } = render(<Projects projects={mockProjects} locale="en" />, { wrapper: Wrapper });
    expect(container.querySelector('#projects')).toBeDefined();
  });

  it('Blog renders with data', () => {
    const { container } = render(<Blog blogs={mockBlogs} locale="en" />, { wrapper: Wrapper });
    expect(container.querySelector('#blog')).toBeDefined();
  });

  it('Skills renders empty state gracefully', () => {
    const { container } = render(<Skills skills={[]} locale="en" />, { wrapper: Wrapper });
    expect(container.querySelector('#skills')).toBeDefined();
  });

  it('Blog renders empty state gracefully', () => {
    const { container } = render(<Blog blogs={[]} locale="en" />, { wrapper: Wrapper });
    expect(container.querySelector('#blog')).toBeDefined();
  });
});
