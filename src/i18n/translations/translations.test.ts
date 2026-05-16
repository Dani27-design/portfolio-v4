import { describe, it, expect } from 'vitest';
import { en } from './en';
import { id } from './id';

// Type helpers for accessing translations with dynamic keys
type BlogSlug = keyof typeof en.blogEntries;
type BlogEntry = { title: string; excerpt: string };

/**
 * Recursively flattens a nested object into dot-notation keys
 * Example: { nav: { about: "About" } } => { "nav.about": "About" }
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

/**
 * Gets all keys from an object including nested keys in dot notation
 */
function getAllKeys(obj: Record<string, unknown>): string[] {
  return Object.keys(flattenObject(obj));
}

describe('Translation Files Completeness', () => {
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
      const emptyKeys: string[] = [];

      for (const [key, value] of Object.entries(enFlat)) {
        if (value === '') {
          emptyKeys.push(key);
        }
      }

      expect(emptyKeys).toEqual([]);
    });

    it('should have no empty string values in ID translations', () => {
      const emptyKeys: string[] = [];

      for (const [key, value] of Object.entries(idFlat)) {
        if (value === '') {
          emptyKeys.push(key);
        }
      }

      expect(emptyKeys).toEqual([]);
    });

    it('should have no null values in EN translations', () => {
      const nullKeys: string[] = [];

      for (const [key, value] of Object.entries(enFlat)) {
        if (value === null) {
          nullKeys.push(key);
        }
      }

      expect(nullKeys).toEqual([]);
    });

    it('should have no null values in ID translations', () => {
      const nullKeys: string[] = [];

      for (const [key, value] of Object.entries(idFlat)) {
        if (value === null) {
          nullKeys.push(key);
        }
      }

      expect(nullKeys).toEqual([]);
    });
  });

  describe('Array Parity', () => {
    it('should have phrases array with same length in EN and ID', () => {
      expect(Array.isArray(en.phrases)).toBe(true);
      expect(Array.isArray(id.phrases)).toBe(true);
      expect(en.phrases.length).toBe(id.phrases.length);
    });

    it('should have 4 phrases (per spec AC16)', () => {
      expect(en.phrases.length).toBe(4);
      expect(id.phrases.length).toBe(4);
    });
  });
});

describe('AC5: Navigation Translations', () => {
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

describe('AC6: Hero Section Translations', () => {
  it('should have EN hero content', () => {
    expect(en.hero.tagline).toBe('System Architect Core');
    expect(en.hero.headline).toBe("I don't return undefined.");
    expect(en.hero.ctaGame).toBe('Wanna play a game?');
    expect(en.hero.ctaContact).toBe('Protocol_Initialize');
  });

  it('should have ID hero content', () => {
    expect(id.hero.tagline).toBe('Inti Arsitek Sistem');
    expect(id.hero.headline).toBe('Saya tidak mengembalikan undefined.');
    expect(id.hero.ctaGame).toBe('Mau main game?');
    expect(id.hero.ctaContact).toBe('Inisialisasi_Protokol');
  });
});

describe('AC7: About Section Translations', () => {
  it('should have EN about content', () => {
    expect(en.about.title).toBe('Structural Engineer');
    expect(en.about.headline).toBe('I architect systems where reliability is the baseline.');
    expect(en.about.stats.e2e).toBe('Lifecycle Ownership');
    expect(en.about.stats.zero).toBe('Tolerance for Fluff');
    expect(en.about.stats.tdd).toBe('Quality Standard');
  });

  it('should have ID about content', () => {
    expect(id.about.title).toBe('Insinyur Struktural');
    expect(id.about.headline).toBe('Saya merancang sistem di mana keandalan adalah dasar.');
    expect(id.about.stats.e2e).toBe('Kepemilikan Siklus Hidup');
    expect(id.about.stats.zero).toBe('Toleransi terhadap Omong Kosong');
    expect(id.about.stats.tdd).toBe('Standar Kualitas');
  });
});

describe('AC8: Skills Section Translations', () => {
  it('should have EN skills title', () => {
    expect(en.skills.title).toBe('Technical Skills');
  });

  it('should have ID skills title', () => {
    expect(id.skills.title).toBe('Keahlian Teknis');
  });

  it('should have skill group titles in EN', () => {
    expect(en.skills.groups.core).toBeDefined();
    expect(en.skills.groups.client).toBeDefined();
    expect(en.skills.groups.data).toBeDefined();
    expect(en.skills.groups.communication).toBeDefined();
    expect(en.skills.groups.devops).toBeDefined();
    expect(en.skills.groups.ai).toBeDefined();
  });

  it('should have skill group titles in ID', () => {
    expect(id.skills.groups.core).toBe('Rekayasa Inti');
    expect(id.skills.groups.client).toBe('Klien & Antarmuka');
    expect(id.skills.groups.data).toBe('Persistensi & Data');
    expect(id.skills.groups.communication).toBe('Lapisan Komunikasi');
    expect(id.skills.groups.devops).toBe('DevOps & Peralatan');
    expect(id.skills.groups.ai).toBe('Ekosistem AI & Desain');
  });
});

describe('AC9: Experience Section Translations', () => {
  it('should have EN experience title', () => {
    expect(en.experience.title).toBe('Professional Trajectory');
  });

  it('should have ID experience title', () => {
    expect(id.experience.title).toBe('Trajektori Profesional');
  });
});

describe('AC10: Projects Section Translations', () => {
  it('should have EN projects section content', () => {
    expect(en.projects.title).toBe('System Architecture & Deployment');
    expect(en.projects.cta).toBe('ACCESS_SYSTEM_ARCHIVE');
    expect(en.projects.viewDetail).toBe('View_Detail');
    expect(en.projects.metadata.access).toBe('Access: Granted');
    expect(en.projects.metadata.checksum).toBe('Checksum: Validated');
    expect(en.projects.metadata.target).toBe('Target: Prod_Env');
  });

  it('should have ID projects section content', () => {
    expect(id.projects.title).toBe('Arsitektur Sistem & Deployment');
    expect(id.projects.cta).toBe('AKSES_ARSIP_SISTEM');
    expect(id.projects.viewDetail).toBe('Lihat_Detail');
    expect(id.projects.metadata.access).toBe('Akses: Diberikan');
    expect(id.projects.metadata.checksum).toBe('Checksum: Divalidasi');
    expect(id.projects.metadata.target).toBe('Target: Prod_Env');
  });
});

describe('AC11: Blog Section Translations', () => {
  it('should have EN blog section content', () => {
    expect(en.blog.title).toBe('Technical Logs');
    expect(en.blog.cta).toBe('ACCESS_FULL_ARCHIVE');
    expect(en.blog.readEntry).toBe('READ_LOG_ENTRY');
  });

  it('should have ID blog section content', () => {
    expect(id.blog.title).toBe('Log Teknis');
    expect(id.blog.cta).toBe('AKSES_ARSIP_LENGKAP');
    expect(id.blog.readEntry).toBe('BACA_ENTRI_LOG');
  });
});

describe('AC12: Contact Section Translations', () => {
  it('should have EN contact content', () => {
    expect(en.contact.headline).toBe("Let's engineer solutions together.");
    expect(en.contact.labels.title).toBe('01 / Request_Title');
    expect(en.contact.labels.payload).toBe('02 / Query_Payload');
    expect(en.contact.placeholders.title).toBe('Enter project subject...');
    expect(en.contact.placeholders.payload).toBe('Describe project architecture constraints...');
    expect(en.contact.buttons.transmit).toBe('Transmit_Protocol');
    expect(en.contact.buttons.copyUid).toBe('COPY_UID');
  });

  it('should have ID contact content', () => {
    expect(id.contact.headline).toBe('Mari rekayasa solusi bersama.');
    expect(id.contact.labels.title).toBe('01 / Judul_Permintaan');
    expect(id.contact.labels.payload).toBe('02 / Muatan_Pertanyaan');
    expect(id.contact.placeholders.title).toBe('Masukkan subjek proyek...');
    expect(id.contact.placeholders.payload).toBe('Jelaskan batasan arsitektur proyek...');
    expect(id.contact.buttons.transmit).toBe('Transmisi_Protokol');
    expect(id.contact.buttons.copyUid).toBe('SALIN_UID');
  });
});

describe('AC13: Footer Translations', () => {
  it('should have EN footer content', () => {
    expect(en.footer.role).toBe('Senior Systems Engineer');
  });

  it('should have ID footer content', () => {
    expect(id.footer.role).toBe('Insinyur Sistem Senior');
  });
});

describe('AC14: HireMeBanner Translations', () => {
  it('should have EN hire banner content', () => {
    expect(en.hireBanner.badge).toBe('SYSTEM_AVAILABILITY :: OPEN_FOR_MISSIONS');
    expect(en.hireBanner.headline).toBe('Need an Architect to Scale Your Vision?');
    expect(en.hireBanner.cta).toBe('INITIALIZE_Recruitment_Protocol');
  });

  it('should have ID hire banner content', () => {
    expect(id.hireBanner.badge).toBe('KETERSEDIAAN_SISTEM :: TERBUKA_UNTUK_MISI');
    expect(id.hireBanner.headline).toBe('Perlu Arsitek untuk Menskalakan Visi Anda?');
    expect(id.hireBanner.cta).toBe('INISIALISASI_Protokol_PEREKRUTAN');
  });
});

describe('AC15: SkyForceGame Translations', () => {
  it('should have EN game UI content', () => {
    expect(en.game.badge).toBe('[ ENTER_SIMULATION ]');
    expect(en.game.hud.sessionScore).toBe('Session_Score');
    expect(en.game.hud.terminalHigh).toBe('Terminal_High_Mark');
    expect(en.game.hud.nearRecord).toBe('Near_Record');
    expect(en.game.hud.newHighScore).toBe('New_High_Score');
    expect(en.game.preGame.title).toBe('System_Simulation');
    expect(en.game.preGame.waiting).toBe('Awaiting defensive deployment...');
    expect(en.game.countdown.go).toBe('GO');
    expect(en.game.countdown.syncing).toBe('Sync_In_Progress');
    expect(en.game.gameOver.title).toBe('FALLEN');
    expect(en.game.gameOver.subtitle).toBe('Simulation_Terminated');
    expect(en.game.gameOver.finalHarvest).toBe('Final_Harvest');
    expect(en.game.highScore.newMark).toBe('New_Terminal_Mark');
    expect(en.game.highScore.pilotId).toBe('PILOT_ID');
    expect(en.game.highScore.commitIdentity).toBe('COMMIT_IDENTITY');
    expect(en.game.highScore.identitySecured).toBe('Identity_Secured:');
    expect(en.game.highScore.sharePerformance).toBe('SHARE_PERFORMANCE');
    expect(en.game.highScore.redeploy).toBe('RE-DEPLOY');
  });

  it('should have ID game UI content', () => {
    expect(id.game.badge).toBe('[ MASUK_KE_SIMULASI ]');
    expect(id.game.hud.sessionScore).toBe('Skor_Sesi');
    expect(id.game.hud.terminalHigh).toBe('Tanda_Terminal_Tinggi');
    expect(id.game.hud.nearRecord).toBe('Dekat_Rekor');
    expect(id.game.hud.newHighScore).toBe('Skor_Tinggi_Baru');
    expect(id.game.preGame.title).toBe('Simulasi_Sistem');
    expect(id.game.preGame.waiting).toBe('Menunggu deployment defensif...');
    expect(id.game.countdown.go).toBe('MULAI');
    expect(id.game.countdown.syncing).toBe('Sinkronisasi_Dalam_Proses');
    expect(id.game.gameOver.title).toBe('JATUH');
    expect(id.game.gameOver.subtitle).toBe('Simulasi_Dihentikan');
    expect(id.game.gameOver.finalHarvest).toBe('Panen_Akhir');
    expect(id.game.highScore.newMark).toBe('Tanda_Terminal_Baru');
    expect(id.game.highScore.pilotId).toBe('ID_PILOT');
    expect(id.game.highScore.commitIdentity).toBe('KOMIT_IDENTITAS');
    expect(id.game.highScore.identitySecured).toBe('Identitas_Diamankan:');
    expect(id.game.highScore.sharePerformance).toBe('BAGIKAN_PERFORMA');
    expect(id.game.highScore.redeploy).toBe('DEPLOY-ULANG');
  });
});

describe('AC16: Phrases Array Translations', () => {
  it('should have EN phrases', () => {
    expect(en.phrases).toContain('Systems Architect');
    expect(en.phrases).toContain('Fullstack Engineer');
    expect(en.phrases).toContain('Mobile Core Developer');
    expect(en.phrases).toContain('Automation Specialist');
  });

  it('should have ID phrases', () => {
    expect(id.phrases).toContain('Arsitek Sistem');
    expect(id.phrases).toContain('Insinyur Fullstack');
    expect(id.phrases).toContain('Pengembang Inti Mobile');
    expect(id.phrases).toContain('Spesialis Automasi');
  });
});

describe('Type Safety', () => {
  it('should have both translations with identical structure', () => {
    const enKeys = getAllKeys(en as Record<string, unknown>);
    const idKeys = getAllKeys(id as Record<string, unknown>);
    expect(enKeys.sort()).toEqual(idKeys.sort());
  });
});

// ============================================================
// Q2-Q6: Additional content requirements per stakeholder decisions
// ============================================================

describe('Q2: Blog Titles and Excerpts Translated', () => {
  const enBlogEntries = en.blogEntries as Record<string, BlogEntry>;
  const idBlogEntries = id.blogEntries as Record<string, BlogEntry>;

  it('EN should have blog entries with title and excerpt', () => {
    expect(en.blogEntries).toBeDefined();
    expect(Object.keys(en.blogEntries).length).toBeGreaterThanOrEqual(6);
  });

  it('ID should have blog entries with title and excerpt', () => {
    expect(id.blogEntries).toBeDefined();
    expect(Object.keys(id.blogEntries).length).toBeGreaterThanOrEqual(6);
  });

  it('each blog entry should have title and excerpt in both languages', () => {
    const slugs: BlogSlug[] = [
      'debugging-rabbitmq-race-conditions',
      'prisma-orm-performance',
      'reliable-mobile-sync-mqtt',
      'optimizing-postgresql-indexing',
      'monorepo-engineering-workflow',
      'memory-management-react-native',
    ];

    for (const slug of slugs) {
      // EN
      expect(enBlogEntries[slug]).toBeDefined();
      expect(enBlogEntries[slug].title).toBeDefined();
      expect(enBlogEntries[slug].excerpt).toBeDefined();
      expect(enBlogEntries[slug].title.length).toBeGreaterThan(0);
      expect(enBlogEntries[slug].excerpt.length).toBeGreaterThan(0);

      // ID
      expect(idBlogEntries[slug]).toBeDefined();
      expect(idBlogEntries[slug].title).toBeDefined();
      expect(idBlogEntries[slug].excerpt).toBeDefined();
      expect(idBlogEntries[slug].title.length).toBeGreaterThan(0);
      expect(idBlogEntries[slug].excerpt.length).toBeGreaterThan(0);
    }
  });

  it('blog titles should be translated (not identical)', () => {
    expect(en.blogEntries['debugging-rabbitmq-race-conditions'].title)
      .not.toBe(id.blogEntries['debugging-rabbitmq-race-conditions'].title);
  });
});

describe('Q3: Job Titles Translated', () => {
  it('EN should have experience.jobs array', () => {
    expect(en.experience.jobs).toBeDefined();
    expect(Array.isArray(en.experience.jobs)).toBe(true);
    expect(en.experience.jobs.length).toBe(3);
  });

  it('ID should have experience.jobs array', () => {
    expect(id.experience.jobs).toBeDefined();
    expect(Array.isArray(id.experience.jobs)).toBe(true);
    expect(id.experience.jobs.length).toBe(3);
  });

  it('each job should have title, company, period, and points', () => {
    for (const job of en.experience.jobs) {
      expect(job.title).toBeDefined();
      expect(job.company).toBeDefined();
      expect(job.period).toBeDefined();
      expect(job.points).toBeDefined();
      expect(Array.isArray(job.points)).toBe(true);
      expect(job.points.length).toBeGreaterThan(0);
    }

    for (const job of id.experience.jobs) {
      expect(job.title).toBeDefined();
      expect(job.company).toBeDefined();
      expect(job.period).toBeDefined();
      expect(job.points).toBeDefined();
      expect(Array.isArray(job.points)).toBe(true);
      expect(job.points.length).toBeGreaterThan(0);
    }
  });

  it('job titles should be translated', () => {
    expect(en.experience.jobs[0].title).not.toBe(id.experience.jobs[0].title);
    expect(en.experience.jobs[1].title).not.toBe(id.experience.jobs[1].title);
    expect(en.experience.jobs[2].title).not.toBe(id.experience.jobs[2].title);
  });

  it('EN job titles match expected values', () => {
    expect(en.experience.jobs[0].title).toBe('Senior Systems Engineer');
    expect(en.experience.jobs[1].title).toBe('Fullstack Developer');
    expect(en.experience.jobs[2].title).toBe('Mobile Core Specialist');
  });

  it('ID job titles are in Indonesian', () => {
    expect(id.experience.jobs[0].title).toBe('Insinyur Sistem Senior');
    expect(id.experience.jobs[1].title).toBe('Pengembang Fullstack');
    expect(id.experience.jobs[2].title).toBe('Spesialis Inti Mobile');
  });
});

describe('Q4: Project Names Translated', () => {
  it('EN should have projectItems array', () => {
    expect(en.projectItems).toBeDefined();
    expect(Array.isArray(en.projectItems)).toBe(true);
    expect(en.projectItems.length).toBe(6);
  });

  it('ID should have projectItems array', () => {
    expect(id.projectItems).toBeDefined();
    expect(Array.isArray(id.projectItems)).toBe(true);
    expect(id.projectItems.length).toBe(6);
  });

  it('each project should have name and desc', () => {
    for (const project of en.projectItems) {
      expect(project.name).toBeDefined();
      expect(project.desc).toBeDefined();
      expect(project.name.length).toBeGreaterThan(0);
      expect(project.desc.length).toBeGreaterThan(0);
    }

    for (const project of id.projectItems) {
      expect(project.name).toBeDefined();
      expect(project.desc).toBeDefined();
      expect(project.name.length).toBeGreaterThan(0);
      expect(project.desc.length).toBeGreaterThan(0);
    }
  });

  it('project names should be translated', () => {
    expect(en.projectItems[0].name).not.toBe(id.projectItems[0].name);
  });

  it('EN project names match constants', () => {
    expect(en.projectItems[0].name).toBe('Distributed IoT Orchestration');
    expect(en.projectItems[1].name).toBe('Enterprise Mobile Core v2');
    expect(en.projectItems[2].name).toBe('Financial Ledger Engine');
  });
});

describe('Q5: Tech Skill Names Structure', () => {
  it('EN should have skills.items object with skill arrays', () => {
    expect(en.skills.items).toBeDefined();
    expect(en.skills.items.core).toBeDefined();
    expect(Array.isArray(en.skills.items.core)).toBe(true);
  });

  it('ID should have skills.items object with skill arrays', () => {
    expect(id.skills.items).toBeDefined();
    expect(id.skills.items.core).toBeDefined();
    expect(Array.isArray(id.skills.items.core)).toBe(true);
  });

  it('skill items should have same count in both languages', () => {
    expect(en.skills.items.core.length).toBe(id.skills.items.core.length);
    expect(en.skills.items.client.length).toBe(id.skills.items.client.length);
    expect(en.skills.items.data.length).toBe(id.skills.items.data.length);
    expect(en.skills.items.communication.length).toBe(id.skills.items.communication.length);
    expect(en.skills.items.devops.length).toBe(id.skills.items.devops.length);
    expect(en.skills.items.ai.length).toBe(id.skills.items.ai.length);
  });
});

describe('Q6: Date Formatting', () => {
  it('EN should have dateFormat configuration', () => {
    expect(en.dateFormat).toBeDefined();
    expect(en.dateFormat.locale).toBe('en-US');
  });

  it('ID should have dateFormat configuration', () => {
    expect(id.dateFormat).toBeDefined();
    expect(id.dateFormat.locale).toBe('id-ID');
  });

  it('ID should have Indonesian month abbreviations', () => {
    expect(id.dateFormat.months).toBeDefined();
    expect(id.dateFormat.months.length).toBe(12);
    expect(id.dateFormat.months[0]).toBe('Jan');
    expect(id.dateFormat.months[9]).toBe('Okt');
    expect(id.dateFormat.months[11]).toBe('Des');
  });

  it('EN should have English month abbreviations', () => {
    expect(en.dateFormat.months).toBeDefined();
    expect(en.dateFormat.months.length).toBe(12);
    expect(en.dateFormat.months[0]).toBe('Jan');
    expect(en.dateFormat.months[9]).toBe('Oct');
    expect(en.dateFormat.months[11]).toBe('Dec');
  });
});
