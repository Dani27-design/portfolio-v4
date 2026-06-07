import { describe, it, expect } from 'vitest';
import {
  validate,
  blogCreateSchema,
  blogUpdateSchema,
  projectCreateSchema,
  projectUpdateSchema,
  experienceCreateSchema,
  experienceUpdateSchema,
  skillGroupCreateSchema,
  skillGroupUpdateSchema,
  heroContentSchema,
  aboutContentSchema,
  contactContentSchema,
  footerContentSchema,
  hireBannerContentSchema,
  navbarContentSchema,
} from './validation';

// --- Helpers ---

const bilingual = (en = 'EN text', id = 'ID text') => ({ en, id });
const bilingualArray = (en = ['A'], id = ['B']) => ({ en, id });

// --- Blog ---

const validBlog = {
  slug: 'my-blog-post',
  title: bilingual(),
  excerpt: bilingual(),
  content: '# Hello world',
  date: '2025-01-01',
  order: 1,
};

describe('blogCreateSchema', () => {
  it('accepts valid blog data', () => {
    const result = validate(blogCreateSchema, validBlog);
    expect(result.slug).toBe('my-blog-post');
  });

  it('accepts optional coverImage', () => {
    const result = validate(blogCreateSchema, { ...validBlog, coverImage: 'https://example.com/img.webp' });
    expect(result.coverImage).toBe('https://example.com/img.webp');
  });

  it('rejects missing slug', () => {
    const { slug: _, ...rest } = validBlog;
    expect(() => validate(blogCreateSchema, rest)).toThrow('Validation failed');
  });

  it('rejects invalid slug format', () => {
    expect(() => validate(blogCreateSchema, { ...validBlog, slug: 'Has Spaces!' })).toThrow('Slug must be lowercase');
  });

  it('rejects oversized content', () => {
    expect(() => validate(blogCreateSchema, { ...validBlog, content: 'x'.repeat(200001) })).toThrow('Validation failed');
  });

  it('rejects wrong type for order', () => {
    expect(() => validate(blogCreateSchema, { ...validBlog, order: 'abc' })).toThrow('Validation failed');
  });

  it('rejects invalid date format', () => {
    expect(() => validate(blogCreateSchema, { ...validBlog, date: 'January 2025' })).toThrow('Date must start with YYYY-MM-DD');
  });

  it('accepts valid ISO date', () => {
    const result = validate(blogCreateSchema, { ...validBlog, date: '2025-05-17' });
    expect(result.date).toBe('2025-05-17');
  });

  it('strips unknown keys', () => {
    const result = validate(blogCreateSchema, { ...validBlog, malicious: 'injected' });
    expect((result as Record<string, unknown>).malicious).toBeUndefined();
  });
});

describe('blogUpdateSchema', () => {
  it('accepts partial data', () => {
    const result = validate(blogUpdateSchema, { title: bilingual('New', 'Baru') });
    expect(result.title?.en).toBe('New');
  });

  it('accepts empty object', () => {
    const result = validate(blogUpdateSchema, {});
    expect(result).toEqual({});
  });

  it('validates provided fields', () => {
    expect(() => validate(blogUpdateSchema, { slug: 'INVALID SLUG!' })).toThrow('Slug must be lowercase');
  });
});

// --- Project ---

const validProject = {
  slug: 'my-project',
  name: bilingual(),
  desc: bilingual(),
  tech: ['React', 'Node.js'],
  status: 'PRODUCTION',
  order: 1,
};

describe('projectCreateSchema', () => {
  it('accepts valid project data', () => {
    const result = validate(projectCreateSchema, validProject);
    expect(result.slug).toBe('my-project');
  });

  it('accepts optional media', () => {
    const result = validate(projectCreateSchema, {
      ...validProject,
      media: [{ url: 'https://example.com/img.png', type: 'image', order: 0 }],
    });
    expect(result.media).toHaveLength(1);
  });

  it('rejects invalid media type', () => {
    expect(() => validate(projectCreateSchema, {
      ...validProject,
      media: [{ url: 'x', type: 'pdf', order: 0 }],
    })).toThrow('Validation failed');
  });

  it('rejects too many tech items', () => {
    expect(() => validate(projectCreateSchema, {
      ...validProject,
      tech: Array(31).fill('x'),
    })).toThrow('Validation failed');
  });

  it('strips unknown keys', () => {
    const result = validate(projectCreateSchema, { ...validProject, extra: true });
    expect((result as Record<string, unknown>).extra).toBeUndefined();
  });
});

describe('projectUpdateSchema', () => {
  it('accepts partial data', () => {
    const result = validate(projectUpdateSchema, { status: 'ARCHIVE' });
    expect(result.status).toBe('ARCHIVE');
  });
});

// --- Experience ---

const validExperience = {
  title: bilingual(),
  company: 'Acme Inc',
  period: bilingual('2024-now', '2024-sekarang'),
  points: bilingualArray(['Built stuff'], ['Bangun sesuatu']),
  isCurrent: true,
  order: 0,
};

describe('experienceCreateSchema', () => {
  it('accepts valid experience data', () => {
    const result = validate(experienceCreateSchema, validExperience);
    expect(result.company).toBe('Acme Inc');
  });

  it('rejects missing company', () => {
    const { company: _, ...rest } = validExperience;
    expect(() => validate(experienceCreateSchema, rest)).toThrow('Validation failed');
  });

  it('rejects wrong isCurrent type', () => {
    expect(() => validate(experienceCreateSchema, { ...validExperience, isCurrent: 'yes' })).toThrow('Validation failed');
  });

  it('rejects too many points', () => {
    expect(() => validate(experienceCreateSchema, {
      ...validExperience,
      points: { en: Array(21).fill('x'), id: [] },
    })).toThrow('Validation failed');
  });
});

describe('experienceUpdateSchema', () => {
  it('accepts partial data', () => {
    const result = validate(experienceUpdateSchema, { isCurrent: false });
    expect(result.isCurrent).toBe(false);
  });
});

// --- Skills ---

const validSkillGroup = {
  title: bilingual(),
  context: bilingual(),
  skills: [{ name: 'TypeScript', tag: 'STRICT' }],
  order: 0,
};

describe('skillGroupCreateSchema', () => {
  it('accepts valid skill group data', () => {
    const result = validate(skillGroupCreateSchema, validSkillGroup);
    expect(result.skills).toHaveLength(1);
  });

  it('rejects too many skills', () => {
    expect(() => validate(skillGroupCreateSchema, {
      ...validSkillGroup,
      skills: Array(51).fill({ name: 'x', tag: 'y' }),
    })).toThrow('Validation failed');
  });

  it('strips unknown keys from skill items', () => {
    const result = validate(skillGroupCreateSchema, {
      ...validSkillGroup,
      skills: [{ name: 'TS', tag: 'CORE', extra: 'bad' }],
    });
    expect((result.skills[0] as Record<string, unknown>).extra).toBeUndefined();
  });
});

describe('skillGroupUpdateSchema', () => {
  it('accepts partial data', () => {
    const result = validate(skillGroupUpdateSchema, { order: 5 });
    expect(result.order).toBe(5);
  });
});

// --- Site Content ---

describe('heroContentSchema', () => {
  it('accepts valid hero data', () => {
    const result = validate(heroContentSchema, {
      tagline: bilingual(),
      headline: bilingual(),
      desc: bilingual(),
      ctaGame: bilingual(),
      ctaContact: bilingual(),
      phrases: bilingualArray(),
    });
    expect(result.tagline.en).toBe('EN text');
  });

  it('rejects missing headline', () => {
    expect(() => validate(heroContentSchema, {
      tagline: bilingual(),
      desc: bilingual(),
      ctaGame: bilingual(),
      ctaContact: bilingual(),
      phrases: bilingualArray(),
    })).toThrow('Validation failed');
  });
});

describe('aboutContentSchema', () => {
  it('accepts valid about data', () => {
    const result = validate(aboutContentSchema, {
      title: bilingual(),
      headline: bilingual(),
      desc: bilingual(),
      stats: {
        stat1: { value: 'E2E', label: bilingual() },
        stat2: { value: '0%', label: bilingual() },
        stat3: { value: 'TDD', label: bilingual() },
      },
    });
    expect(result.stats.stat1.value).toBe('E2E');
  });

  it('accepts optional avatarUrl', () => {
    const result = validate(aboutContentSchema, {
      title: bilingual(),
      headline: bilingual(),
      desc: bilingual(),
      avatarUrl: 'https://example.com/avatar.png',
      stats: {
        stat1: { value: 'E2E', label: bilingual() },
        stat2: { value: '0%', label: bilingual() },
        stat3: { value: 'TDD', label: bilingual() },
      },
    });
    expect(result.avatarUrl).toBe('https://example.com/avatar.png');
  });
});

describe('contactContentSchema', () => {
  it('accepts valid contact data', () => {
    const result = validate(contactContentSchema, {
      headline: bilingual(),
      desc: bilingual(),
      email: 'test@test.com',
      labels: { title: bilingual(), payload: bilingual() },
      placeholders: { title: bilingual(), payload: bilingual() },
      buttons: { transmit: bilingual(), copyUid: bilingual() },
      socials: { github: 'https://github.com/x', linkedin: 'https://linkedin.com/x', instagram: 'https://instagram.com/x', whatsapp: 'https://wa.me/123' },
    });
    expect(result.email).toBe('test@test.com');
  });

  it('rejects invalid email format', () => {
    expect(() => validate(contactContentSchema, {
      headline: bilingual(),
      desc: bilingual(),
      email: 'not-an-email',
      labels: { title: bilingual(), payload: bilingual() },
      placeholders: { title: bilingual(), payload: bilingual() },
      buttons: { transmit: bilingual(), copyUid: bilingual() },
      socials: { github: '', linkedin: '', instagram: '', whatsapp: '' },
    })).toThrow('Validation failed');
  });
});

describe('footerContentSchema', () => {
  it('accepts valid footer data', () => {
    const result = validate(footerContentSchema, {
      ownerName: 'John Doe',
      role: bilingual(),
    });
    expect(result.ownerName).toBe('John Doe');
  });

  it('rejects empty ownerName', () => {
    expect(() => validate(footerContentSchema, {
      ownerName: '',
      role: bilingual(),
    })).toThrow('Validation failed');
  });
});

describe('hireBannerContentSchema', () => {
  it('accepts valid hire banner data', () => {
    const result = validate(hireBannerContentSchema, {
      headline: bilingual(),
      desc: bilingual(),
      cta: bilingual(),
    });
    expect(result.headline.en).toBe('EN text');
  });
});

describe('navbarContentSchema', () => {
  it('accepts valid navbar data', () => {
    const result = validate(navbarContentSchema, {
      labels: {
        about: bilingual(),
        stack: bilingual(),
        experience: bilingual(),
        projects: bilingual(),
        blog: bilingual(),
        contact: bilingual(),
      },
    });
    expect(result.labels.about.en).toBe('EN text');
  });

  it('accepts optional logoUrl and brandName', () => {
    const result = validate(navbarContentSchema, {
      logoUrl: 'https://example.com/logo.png',
      brandName: 'MyBrand',
      labels: {
        about: bilingual(),
        stack: bilingual(),
        experience: bilingual(),
        projects: bilingual(),
        blog: bilingual(),
        contact: bilingual(),
      },
    });
    expect(result.logoUrl).toBe('https://example.com/logo.png');
    expect(result.brandName).toBe('MyBrand');
  });
});

// --- validate helper ---

describe('validate helper', () => {
  it('returns parsed data on success', () => {
    const result = validate(blogCreateSchema, validBlog);
    expect(result.slug).toBe('my-blog-post');
  });

  it('throws descriptive Error on failure', () => {
    try {
      validate(blogCreateSchema, { slug: 123 });
      expect.fail('should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect((err as Error).message).toContain('Validation failed');
    }
  });

  it('includes field path in error message', () => {
    try {
      validate(blogCreateSchema, { ...validBlog, title: { en: 'ok', id: 123 } });
      expect.fail('should have thrown');
    } catch (err) {
      expect((err as Error).message).toMatch(/title\.id/);
    }
  });
});
