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

describe('About Section Translations', () => {
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

describe('Section Titles', () => {
  it('should have skills title', () => {
    expect(en.skills.title).toBe('Technical Skills');
    expect(id.skills.title).toBe('Keahlian Teknis');
  });

  it('should have experience title', () => {
    expect(en.experience.title).toBe('Professional Trajectory');
    expect(id.experience.title).toBe('Trajektori Profesional');
  });
});

describe('Projects Section Translations', () => {
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

describe('Blog Section Translations', () => {
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

describe('Contact Section Translations', () => {
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

describe('Footer Translations', () => {
  it('should have footer role', () => {
    expect(en.footer.role).toBe('Senior Systems Engineer');
    expect(id.footer.role).toBe('Insinyur Sistem Senior');
  });
});

describe('HireBanner Translations', () => {
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

describe('SkyForceGame Translations', () => {
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
    expect(id.game.badge).toBe('[ MASUK_SIMULASI ]');
    expect(id.game.hud.sessionScore).toBe('Skor_Sesi');
    expect(id.game.hud.terminalHigh).toBe('Rekor_Terminal');
    expect(id.game.hud.nearRecord).toBe('Mendekati_Rekor');
    expect(id.game.hud.newHighScore).toBe('Rekor_Baru');
    expect(id.game.preGame.title).toBe('Simulasi_Sistem');
    expect(id.game.preGame.waiting).toBe('Menunggu deployment defensif...');
    expect(id.game.countdown.go).toBe('MULAI');
    expect(id.game.countdown.syncing).toBe('Sinkronisasi_Berlangsung');
    expect(id.game.gameOver.title).toBe('GUGUR');
    expect(id.game.gameOver.subtitle).toBe('Simulasi_Dihentikan');
    expect(id.game.gameOver.finalHarvest).toBe('Hasil_Akhir');
    expect(id.game.highScore.newMark).toBe('Rekor_Terminal_Baru');
    expect(id.game.highScore.pilotId).toBe('ID_PILOT');
    expect(id.game.highScore.commitIdentity).toBe('KOMIT_IDENTITAS');
    expect(id.game.highScore.identitySecured).toBe('Identitas_Diamankan:');
    expect(id.game.highScore.sharePerformance).toBe('BAGIKAN_PERFORMA');
    expect(id.game.highScore.redeploy).toBe('DEPLOY_ULANG');
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
    expect(en.phrases).toContain('Systems Architect');
    expect(en.phrases).toContain('Fullstack Engineer');
    expect(en.phrases).toContain('Mobile Core Developer');
    expect(en.phrases).toContain('Automation Specialist');
  });

  it('should have ID phrases', () => {
    expect(id.phrases).toContain('Arsitek Sistem');
    expect(id.phrases).toContain('Insinyur Fullstack');
    expect(id.phrases).toContain('Pengembang Inti Mobile');
    expect(id.phrases).toContain('Spesialis Otomasi');
  });
});
