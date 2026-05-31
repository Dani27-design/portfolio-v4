import { describe, it, expect } from 'vitest';
import en from '../../messages/en.json';
import id from '../../messages/id.json';

/**
 * Recursively flattens a nested object into dot-notation keys
 */
function flattenObject(obj: Record<string, unknown>, prefix = ''): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const key of Object.keys(obj)) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value as Record<string, unknown>, newKey));
    } else {
      result[newKey] = value;
    }
  }

  return result;
}

describe('Translation Files Completeness (JSON)', () => {
  const enFlat = flattenObject(en as Record<string, unknown>);
  const idFlat = flattenObject(id as Record<string, unknown>);
  const enKeys = Object.keys(enFlat).sort();
  const idKeys = Object.keys(idFlat).sort();

  describe('Key Parity', () => {
    it('should have the same keys in EN and ID translations', () => {
      expect(enKeys).toEqual(idKeys);
    });

    it('should have EN keys that all exist in ID', () => {
      const missingInId = enKeys.filter(key => !idKeys.includes(key));
      expect(missingInId).toEqual([]);
    });

    it('should have ID keys that all exist in EN', () => {
      const missingInEn = idKeys.filter(key => !enKeys.includes(key));
      expect(missingInEn).toEqual([]);
    });
  });

  describe('No Empty Values', () => {
    it('should have no empty string values in EN translations', () => {
      const emptyKeys = Object.entries(enFlat)
        .filter(([, value]) => value === '')
        .map(([key]) => key);
      expect(emptyKeys).toEqual([]);
    });

    it('should have no empty string values in ID translations', () => {
      const emptyKeys = Object.entries(idFlat)
        .filter(([, value]) => value === '')
        .map(([key]) => key);
      expect(emptyKeys).toEqual([]);
    });

    it('should have no null values in EN translations', () => {
      const nullKeys = Object.entries(enFlat)
        .filter(([, value]) => value === null)
        .map(([key]) => key);
      expect(nullKeys).toEqual([]);
    });

    it('should have no null values in ID translations', () => {
      const nullKeys = Object.entries(idFlat)
        .filter(([, value]) => value === null)
        .map(([key]) => key);
      expect(nullKeys).toEqual([]);
    });
  });

  describe('Phrases Array', () => {
    it('should have phrases array with same length in EN and ID', () => {
      expect(Array.isArray(en.phrases)).toBe(true);
      expect(Array.isArray(id.phrases)).toBe(true);
      expect(en.phrases.length).toBe(id.phrases.length);
    });

    it('should have 4 phrases', () => {
      expect(en.phrases.length).toBe(4);
      expect(id.phrases.length).toBe(4);
    });
  });
});

describe('Navigation Translations', () => {
  it('should have EN navigation labels', () => {
    expect(en.nav.about).toBe('About');
    expect(en.nav.stack).toBe('Stack');
    expect(en.nav.experience).toBe('Experience');
    expect(en.nav.projects).toBe('Projects');
    expect(en.nav.blog).toBe('Blog');
    expect(en.nav.contact).toBe('Contact');
  });

  it('should have ID navigation labels', () => {
    expect(id.nav.about).toBe('Tentang');
    expect(id.nav.stack).toBe('Keahlian');
    expect(id.nav.experience).toBe('Pengalaman');
    expect(id.nav.projects).toBe('Proyek');
    expect(id.nav.blog).toBe('Blog');
    expect(id.nav.contact).toBe('Kontak');
  });
});

describe('Hero Section Translations', () => {
  it('should have EN hero content', () => {
    expect(en.hero.tagline).toBe('Fullstack & Mobile Engineer');
    expect(en.hero.headline).toBe("I don't return undefined.");
    expect(en.hero.ctaGame).toBe('Wanna play a game?');
    expect(en.hero.ctaContact).toBe('Get in Touch');
  });

  it('should have ID hero content', () => {
    expect(id.hero.tagline).toBe('Fullstack & Mobile Engineer');
    expect(id.hero.headline).toBe('Saya tidak mengembalikan undefined.');
    expect(id.hero.ctaGame).toBe('Mau main game?');
    expect(id.hero.ctaContact).toBe('Hubungi Saya');
  });
});

describe('About Section Translations', () => {
  it('should have EN about content', () => {
    expect(en.about.title).toBe('About Me');
    expect(en.about.headline).toBe('I architect systems where reliability is the baseline.');
    expect(en.about.stats.e2e).toBe('Lifecycle Ownership');
    expect(en.about.stats.zero).toBe('Tolerance for Fluff');
    expect(en.about.stats.tdd).toBe('Quality Standard');
  });

  it('should have ID about content', () => {
    expect(id.about.title).toBe('Software Developer');
    expect(id.about.headline).toBe('Saya membangun sistem yang mengutamakan keandalan.');
    expect(id.about.stats.e2e).toBe('End-to-End Ownership');
    expect(id.about.stats.zero).toBe('Zero Tolerance for Fluff');
    expect(id.about.stats.tdd).toBe('Standar Kualitas');
  });
});

describe('Section Titles', () => {
  it('should have skills title', () => {
    expect(en.skills.title).toBe('Technical Skills');
    expect(id.skills.title).toBe('Keahlian Teknis');
  });

  it('should have experience title', () => {
    expect(en.experience.title).toBe('Work Experience');
    expect(id.experience.title).toBe('Pengalaman Kerja');
  });
});

describe('Projects Section Translations', () => {
  it('should have EN projects section content', () => {
    expect(en.projects.title).toBe('Projects');
    expect(en.projects.cta).toBe('View All Projects');
    expect(en.projects.metadata.access).toBe('View Details');
  });

  it('should have ID projects section content', () => {
    expect(id.projects.title).toBe('Proyek');
    expect(id.projects.cta).toBe('Lihat Semua Proyek');
    expect(id.projects.metadata.access).toBe('Lihat Detail');
  });
});

describe('Blog Section Translations', () => {
  it('should have EN blog section content', () => {
    expect(en.blog.title).toBe('Blog');
    expect(en.blog.cta).toBe('View All Posts');
    expect(en.blog.readEntry).toBe('Read Article');
    expect(en.blog.archiveTitle).toBe('All Posts');
    expect(en.blog.backToHome).toBe('Back to Home');
    expect(en.blog.backToBlog).toBe('Back to Blog');
    expect(en.blog.badgeType).toBe('Technical Article');
    expect(en.blog.badgeStatus).toBe('Published');
  });

  it('should have ID blog section content', () => {
    expect(id.blog.title).toBe('Blog');
    expect(id.blog.cta).toBe('Lihat Semua Artikel');
    expect(id.blog.readEntry).toBe('Baca Artikel');
    expect(id.blog.archiveTitle).toBe('Semua Artikel');
    expect(id.blog.backToHome).toBe('Kembali ke Beranda');
    expect(id.blog.backToBlog).toBe('Kembali ke Blog');
    expect(id.blog.badgeType).toBe('Artikel Teknis');
    expect(id.blog.badgeStatus).toBe('Diterbitkan');
  });
});

describe('Contact Section Translations', () => {
  it('should have EN contact content', () => {
    expect(en.contact.headline).toBe("Let's engineer solutions together.");
    expect(en.contact.labels.title).toBe('01 / Subject');
    expect(en.contact.labels.payload).toBe('02 / Message');
    expect(en.contact.placeholders.title).toBe('Enter project subject...');
    expect(en.contact.placeholders.payload).toBe('Describe your project needs...');
    expect(en.contact.buttons.transmit).toBe('Send Message');
    expect(en.contact.buttons.copyUid).toBe('Copy Email');
    expect(en.contact.emailLabel).toBe('Email');
    expect(en.contact.copied).toBe('Copied');
    expect(en.contact.diagnostics).toBe('Diagnostics');
    expect(en.contact.responseTimeLabel).toBe('Response Time');
    expect(en.contact.responseTimeValue).toBe('Within 24 hours');
  });

  it('should have ID contact content', () => {
    expect(id.contact.headline).toBe('Mari bangun solusi bersama.');
    expect(id.contact.labels.title).toBe('01 / Subjek');
    expect(id.contact.labels.payload).toBe('02 / Pesan');
    expect(id.contact.placeholders.title).toBe('Tulis subjek proyek...');
    expect(id.contact.placeholders.payload).toBe('Jelaskan kebutuhan proyek Anda...');
    expect(id.contact.buttons.transmit).toBe('Kirim Pesan');
    expect(id.contact.buttons.copyUid).toBe('Salin Email');
    expect(id.contact.emailLabel).toBe('Email');
    expect(id.contact.copied).toBe('Tersalin');
    expect(id.contact.diagnostics).toBe('Diagnostik');
    expect(id.contact.responseTimeLabel).toBe('Waktu Respons');
    expect(id.contact.responseTimeValue).toBe('Dalam 24 jam');
  });
});

describe('Footer Translations', () => {
  it('should have footer role', () => {
    expect(en.footer.role).toBe('Software Developer');
    expect(id.footer.role).toBe('Software Developer');
  });
});

describe('HireBanner Translations', () => {
  it('should have EN hire banner content', () => {
    expect(en.hireBanner.headline).toBe('Need an Architect to Scale Your Vision?');
    expect(en.hireBanner.cta).toBe("Let's Work Together");
  });

  it('should have ID hire banner content', () => {
    expect(id.hireBanner.headline).toBe('Butuh Developer untuk Mewujudkan Visi Anda?');
    expect(id.hireBanner.cta).toBe('Mari Bekerja Sama');
  });
});

describe('SkyForceGame Translations', () => {
  it('should have EN game UI content', () => {
    expect(en.game.badge).toBe('Mini Game');
    expect(en.game.hud.sessionScore).toBe('Score');
    expect(en.game.hud.terminalHigh).toBe('High Score');
    expect(en.game.hud.nearRecord).toBe('Near Record');
    expect(en.game.hud.newHighScore).toBe('New High Score');
    expect(en.game.preGame.title).toBe('Sky Defender');
    expect(en.game.preGame.waiting).toBe('Tap or click to start');
    expect(en.game.countdown.go).toBe('GO');
    expect(en.game.countdown.syncing).toBe('Get Ready');
    expect(en.game.gameOver.title).toBe('FALLEN');
    expect(en.game.gameOver.subtitle).toBe('Game Over');
    expect(en.game.gameOver.finalHarvest).toBe('Final Score');
    expect(en.game.highScore.newMark).toBe('New Record');
    expect(en.game.highScore.pilotId).toBe('Your Name');
    expect(en.game.highScore.commitIdentity).toBe('Save');
    expect(en.game.highScore.identitySecured).toBe('Saved:');
    expect(en.game.highScore.sharePerformance).toBe('Share Score');
    expect(en.game.highScore.redeploy).toBe('Play Again');
    expect(en.game.shareText).toContain('{score}');
    expect(en.game.ariaLabel).toContain('Sky Defender');
  });

  it('should have ID game UI content', () => {
    expect(id.game.badge).toBe('Mini Game');
    expect(id.game.hud.sessionScore).toBe('Skor');
    expect(id.game.hud.terminalHigh).toBe('Skor Tertinggi');
    expect(id.game.hud.nearRecord).toBe('Hampir Rekor');
    expect(id.game.hud.newHighScore).toBe('Rekor Baru');
    expect(id.game.preGame.title).toBe('Sky Defender');
    expect(id.game.preGame.waiting).toBe('Tap atau klik untuk mulai');
    expect(id.game.countdown.go).toBe('GO');
    expect(id.game.countdown.syncing).toBe('Bersiap');
    expect(id.game.gameOver.title).toBe('FALLEN');
    expect(id.game.gameOver.subtitle).toBe('Game Over');
    expect(id.game.gameOver.finalHarvest).toBe('Skor Akhir');
    expect(id.game.highScore.newMark).toBe('Rekor Baru');
    expect(id.game.highScore.pilotId).toBe('Nama Kamu');
    expect(id.game.highScore.commitIdentity).toBe('Simpan');
    expect(id.game.highScore.identitySecured).toBe('Tersimpan:');
    expect(id.game.highScore.sharePerformance).toBe('Bagikan Skor');
    expect(id.game.highScore.redeploy).toBe('Main Lagi');
    expect(id.game.shareText).toContain('{score}');
    expect(id.game.ariaLabel).toBeDefined();
  });
});

describe('SEO Metadata Translations', () => {
  it('should have EN SEO metadata', () => {
    expect(en.seo.homeTitle).toContain('Daniansyah');
    expect(en.seo.homeDescription.length).toBeGreaterThan(50);
    expect(en.seo.blogTitle).toBeDefined();
    expect(en.seo.projectsTitle).toBeDefined();
  });

  it('should have ID SEO metadata', () => {
    expect(id.seo.homeTitle).toContain('Daniansyah');
    expect(id.seo.homeDescription.length).toBeGreaterThan(50);
    expect(id.seo.blogTitle).toBeDefined();
    expect(id.seo.projectsTitle).toBeDefined();
  });
});

describe('Date Formatting', () => {
  it('should have EN date format configuration', () => {
    expect(en.dateFormat.locale).toBe('en-US');
    expect(en.dateFormat.months.length).toBe(12);
    expect(en.dateFormat.months[0]).toBe('Jan');
    expect(en.dateFormat.months[11]).toBe('Dec');
  });

  it('should have ID date format configuration', () => {
    expect(id.dateFormat.locale).toBe('id-ID');
    expect(id.dateFormat.months.length).toBe(12);
    expect(id.dateFormat.months[0]).toBe('Jan');
    expect(id.dateFormat.months[11]).toBe('Des');
  });
});

describe('Phrases', () => {
  it('should have EN phrases', () => {
    expect(en.phrases).toContain('Software Developer');
    expect(en.phrases).toContain('Fullstack Engineer');
    expect(en.phrases).toContain('Mobile Developer');
    expect(en.phrases).toContain('React & Node.js');
  });

  it('should have ID phrases', () => {
    expect(id.phrases).toContain('Software Developer');
    expect(id.phrases).toContain('Fullstack Engineer');
    expect(id.phrases).toContain('Mobile Developer');
    expect(id.phrases).toContain('React & Node.js');
  });
});
