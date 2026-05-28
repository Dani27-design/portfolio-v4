'use client';

import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { updateHeroContent, updateAboutContent, updateContactContent, updateFooterContent, updateHireBannerContent, updateNavbarContent } from '@/actions/siteContent';
import type { HeroContent, AboutContent, ContactContent, FooterContent, HireBannerContent, NavbarContent } from '@/types';

const inputClass = "bg-slate-900 border border-slate-600 rounded px-3 py-2.5 lg:py-2 text-sm text-white outline-none focus:border-cyan-500 w-full";

function MobileLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs text-slate-400 mb-1 lg:hidden">{children}</label>;
}

function SectionCard({ id, title, openSection, setOpenSection, children }: {
  id: string;
  title: string;
  openSection: string | null;
  setOpenSection: (id: string | null) => void;
  children: React.ReactNode;
}) {
  const isOpen = openSection === id;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpenSection(isOpen ? null : id)}
        className="w-full flex justify-between items-center p-4 lg:hidden text-left"
      >
        <span className="text-sm font-bold text-white">{title}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block p-4 lg:p-6 ${isOpen ? 'border-t border-slate-700 lg:border-t-0' : ''}`}>
        <h2 className="hidden lg:block text-lg font-bold text-white mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}

export default function AdminSiteContentPage() {
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [contact, setContact] = useState<ContactContent | null>(null);
  const [footer, setFooter] = useState<FooterContent | null>(null);
  const [hireBanner, setHireBanner] = useState<HireBannerContent | null>(null);
  const [navbar, setNavbar] = useState<NavbarContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const fetchData = async () => {
    setFetchError(null);
    try {
      const res = await fetch('/api/admin/site-content');
      if (!res.ok) throw new Error('Failed to load site content');
      const data = await res.json();
      setHero(data.hero);
      setAbout(data.about);
      setContact(data.contact);
      setFooter(data.footer);
      setHireBanner(data.hireBanner);
      setNavbar(data.navbar);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Failed to load site content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div className="text-slate-400">Loading...</div>;

  return (
    <div>
      <h1 className="text-xl lg:text-2xl font-bold text-white mb-6 lg:mb-8">Site Content</h1>

      {fetchError && (
        <div className="flex items-center justify-between p-3 mb-6 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
          <span>{fetchError}</span>
          <button onClick={fetchData} className="text-xs font-bold uppercase tracking-wider hover:text-red-300">Retry</button>
        </div>
      )}

      <div className="space-y-4 lg:space-y-8">
        <SectionCard id="hero" title="Hero Section" openSection={openSection} setOpenSection={setOpenSection}>
          <HeroForm hero={hero} onSave={fetchData} />
        </SectionCard>
        <SectionCard id="about" title="About Section" openSection={openSection} setOpenSection={setOpenSection}>
          <AboutForm about={about} onSave={fetchData} />
        </SectionCard>
        <SectionCard id="contact" title="Contact Section" openSection={openSection} setOpenSection={setOpenSection}>
          <ContactForm contact={contact} onSave={fetchData} />
        </SectionCard>
        <SectionCard id="footer" title="Footer" openSection={openSection} setOpenSection={setOpenSection}>
          <FooterForm footer={footer} onSave={fetchData} />
        </SectionCard>
        <SectionCard id="hireBanner" title="Hire Me Banner" openSection={openSection} setOpenSection={setOpenSection}>
          <HireBannerForm hireBanner={hireBanner} onSave={fetchData} />
        </SectionCard>
        <SectionCard id="navbar" title="Navbar Labels" openSection={openSection} setOpenSection={setOpenSection}>
          <NavbarForm navbar={navbar} onSave={fetchData} />
        </SectionCard>
      </div>
    </div>
  );
}

function HeroForm({ hero, onSave }: { hero: HeroContent | null; onSave: () => void }) {
  const [form, setForm] = useState({
    taglineEn: hero?.tagline.en || '', taglineId: hero?.tagline.id || '',
    headlineEn: hero?.headline.en || '', headlineId: hero?.headline.id || '',
    descEn: hero?.desc.en || '', descId: hero?.desc.id || '',
    ctaGameEn: hero?.ctaGame.en || '', ctaGameId: hero?.ctaGame.id || '',
    ctaContactEn: hero?.ctaContact.en || '', ctaContactId: hero?.ctaContact.id || '',
    phrasesEn: hero?.phrases.en.join('\n') || '', phrasesId: hero?.phrases.id.join('\n') || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess(false); setSaving(true);
    try {
      await updateHeroContent({
        tagline: { en: form.taglineEn, id: form.taglineId },
        headline: { en: form.headlineEn, id: form.headlineId },
        desc: { en: form.descEn, id: form.descId },
        ctaGame: { en: form.ctaGameEn, id: form.ctaGameId },
        ctaContact: { en: form.ctaContactEn, id: form.ctaContactId },
        phrases: { en: form.phrasesEn.split('\n').filter(Boolean), id: form.phrasesId.split('\n').filter(Boolean) },
      });
      setSuccess(true); onSave(); setTimeout(() => setSuccess(false), 3000);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to save'); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">{error}</div>}
      {success && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 text-sm">Hero content saved successfully</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><MobileLabel>Tagline (EN)</MobileLabel><input value={form.taglineEn} onChange={e => setForm({...form, taglineEn: e.target.value})} placeholder="Tagline (EN)" required className={inputClass} /></div>
        <div><MobileLabel>Tagline (ID)</MobileLabel><input value={form.taglineId} onChange={e => setForm({...form, taglineId: e.target.value})} placeholder="Tagline (ID)" required className={inputClass} /></div>
        <div><MobileLabel>Headline (EN)</MobileLabel><input value={form.headlineEn} onChange={e => setForm({...form, headlineEn: e.target.value})} placeholder="Headline (EN)" required className={inputClass} /></div>
        <div><MobileLabel>Headline (ID)</MobileLabel><input value={form.headlineId} onChange={e => setForm({...form, headlineId: e.target.value})} placeholder="Headline (ID)" required className={inputClass} /></div>
        <div><MobileLabel>Description (EN)</MobileLabel><textarea value={form.descEn} onChange={e => setForm({...form, descEn: e.target.value})} placeholder="Description (EN)" rows={3} required className={inputClass} /></div>
        <div><MobileLabel>Description (ID)</MobileLabel><textarea value={form.descId} onChange={e => setForm({...form, descId: e.target.value})} placeholder="Description (ID)" rows={3} required className={inputClass} /></div>
        <div><MobileLabel>CTA Game (EN)</MobileLabel><input value={form.ctaGameEn} onChange={e => setForm({...form, ctaGameEn: e.target.value})} placeholder="CTA Game (EN)" required className={inputClass} /></div>
        <div><MobileLabel>CTA Game (ID)</MobileLabel><input value={form.ctaGameId} onChange={e => setForm({...form, ctaGameId: e.target.value})} placeholder="CTA Game (ID)" required className={inputClass} /></div>
        <div><MobileLabel>CTA Contact (EN)</MobileLabel><input value={form.ctaContactEn} onChange={e => setForm({...form, ctaContactEn: e.target.value})} placeholder="CTA Contact (EN)" required className={inputClass} /></div>
        <div><MobileLabel>CTA Contact (ID)</MobileLabel><input value={form.ctaContactId} onChange={e => setForm({...form, ctaContactId: e.target.value})} placeholder="CTA Contact (ID)" required className={inputClass} /></div>
      </div>
      <div>
        <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Typewriter Phrases (one per line)</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <textarea value={form.phrasesEn} onChange={e => setForm({...form, phrasesEn: e.target.value})} placeholder="Phrases EN (one per line)" rows={4} required className={inputClass + " font-mono"} />
          <textarea value={form.phrasesId} onChange={e => setForm({...form, phrasesId: e.target.value})} placeholder="Phrases ID (one per line)" rows={4} required className={inputClass + " font-mono"} />
        </div>
      </div>
      <button type="submit" disabled={saving} className="w-full sm:w-auto px-6 py-2.5 lg:py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white text-sm font-bold rounded">{saving ? 'Saving...' : 'Save Hero'}</button>
    </form>
  );
}

function AboutForm({ about, onSave }: { about: AboutContent | null; onSave: () => void }) {
  const [form, setForm] = useState({
    titleEn: about?.title.en || '', titleId: about?.title.id || '',
    headlineEn: about?.headline.en || '', headlineId: about?.headline.id || '',
    descEn: about?.desc.en || '', descId: about?.desc.id || '',
    avatarInitials: about?.avatarInitials || '',
    avatarUrl: about?.avatarUrl || '',
    stat1Value: about?.stats.stat1.value || '', stat1LabelEn: about?.stats.stat1.label.en || '', stat1LabelId: about?.stats.stat1.label.id || '',
    stat2Value: about?.stats.stat2.value || '', stat2LabelEn: about?.stats.stat2.label.en || '', stat2LabelId: about?.stats.stat2.label.id || '',
    stat3Value: about?.stats.stat3.value || '', stat3LabelEn: about?.stats.stat3.label.en || '', stat3LabelId: about?.stats.stat3.label.id || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess(false); setSaving(true);
    try {
      await updateAboutContent({
        title: { en: form.titleEn, id: form.titleId },
        headline: { en: form.headlineEn, id: form.headlineId },
        desc: { en: form.descEn, id: form.descId },
        avatarInitials: form.avatarInitials,
        avatarUrl: form.avatarUrl || undefined,
        stats: {
          stat1: { value: form.stat1Value, label: { en: form.stat1LabelEn, id: form.stat1LabelId } },
          stat2: { value: form.stat2Value, label: { en: form.stat2LabelEn, id: form.stat2LabelId } },
          stat3: { value: form.stat3Value, label: { en: form.stat3LabelEn, id: form.stat3LabelId } },
        },
      });
      setSuccess(true); onSave(); setTimeout(() => setSuccess(false), 3000);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to save'); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">{error}</div>}
      {success && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 text-sm">About content saved successfully</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><MobileLabel>Title Label (EN)</MobileLabel><input value={form.titleEn} onChange={e => setForm({...form, titleEn: e.target.value})} placeholder="Title Label (EN)" required className={inputClass} /></div>
        <div><MobileLabel>Title Label (ID)</MobileLabel><input value={form.titleId} onChange={e => setForm({...form, titleId: e.target.value})} placeholder="Title Label (ID)" required className={inputClass} /></div>
        <div><MobileLabel>Headline (EN)</MobileLabel><input value={form.headlineEn} onChange={e => setForm({...form, headlineEn: e.target.value})} placeholder="Headline (EN)" required className={inputClass} /></div>
        <div><MobileLabel>Headline (ID)</MobileLabel><input value={form.headlineId} onChange={e => setForm({...form, headlineId: e.target.value})} placeholder="Headline (ID)" required className={inputClass} /></div>
        <div><MobileLabel>Description (EN)</MobileLabel><textarea value={form.descEn} onChange={e => setForm({...form, descEn: e.target.value})} placeholder="Description (EN)" rows={3} required className={inputClass} /></div>
        <div><MobileLabel>Description (ID)</MobileLabel><textarea value={form.descId} onChange={e => setForm({...form, descId: e.target.value})} placeholder="Description (ID)" rows={3} required className={inputClass} /></div>
      </div>
      <ImageUpload
        currentUrl={form.avatarUrl}
        storagePath="brand/avatar"
        onUpload={(url) => setForm({...form, avatarUrl: url})}
        onRemove={() => setForm({...form, avatarUrl: ''})}
        label="Avatar Image"
      />
      <div>
        <MobileLabel>Avatar Initials (fallback if no image)</MobileLabel>
        <input value={form.avatarInitials} onChange={e => setForm({...form, avatarInitials: e.target.value})} placeholder="Avatar Initials (e.g. DC)" required className={inputClass + " w-32"} />
      </div>
      <div>
        <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Stats</label>
        <div className="space-y-3">
          {[
            { label: 'Stat 1', vKey: 'stat1Value' as const, enKey: 'stat1LabelEn' as const, idKey: 'stat1LabelId' as const, vPh: 'e.g. E2E' },
            { label: 'Stat 2', vKey: 'stat2Value' as const, enKey: 'stat2LabelEn' as const, idKey: 'stat2LabelId' as const, vPh: 'e.g. 0%' },
            { label: 'Stat 3', vKey: 'stat3Value' as const, enKey: 'stat3LabelEn' as const, idKey: 'stat3LabelId' as const, vPh: 'e.g. TDD' },
          ].map(s => (
            <div key={s.label} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><MobileLabel>{s.label} Value</MobileLabel><input value={form[s.vKey]} onChange={e => setForm({...form, [s.vKey]: e.target.value})} placeholder={`${s.label} Value (${s.vPh})`} required className={inputClass} /></div>
              <div><MobileLabel>{s.label} Label (EN)</MobileLabel><input value={form[s.enKey]} onChange={e => setForm({...form, [s.enKey]: e.target.value})} placeholder={`${s.label} Label (EN)`} required className={inputClass} /></div>
              <div><MobileLabel>{s.label} Label (ID)</MobileLabel><input value={form[s.idKey]} onChange={e => setForm({...form, [s.idKey]: e.target.value})} placeholder={`${s.label} Label (ID)`} required className={inputClass} /></div>
            </div>
          ))}
        </div>
      </div>
      <button type="submit" disabled={saving} className="w-full sm:w-auto px-6 py-2.5 lg:py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white text-sm font-bold rounded">{saving ? 'Saving...' : 'Save About'}</button>
    </form>
  );
}

function ContactForm({ contact, onSave }: { contact: ContactContent | null; onSave: () => void }) {
  const [form, setForm] = useState({
    headlineEn: contact?.headline.en || '', headlineId: contact?.headline.id || '',
    descEn: contact?.desc.en || '', descId: contact?.desc.id || '',
    email: contact?.email || '',
    labelsTitleEn: contact?.labels.title.en || '', labelsTitleId: contact?.labels.title.id || '',
    labelsPayloadEn: contact?.labels.payload.en || '', labelsPayloadId: contact?.labels.payload.id || '',
    placeholdersTitleEn: contact?.placeholders.title.en || '', placeholdersTitleId: contact?.placeholders.title.id || '',
    placeholdersPayloadEn: contact?.placeholders.payload.en || '', placeholdersPayloadId: contact?.placeholders.payload.id || '',
    buttonsTransmitEn: contact?.buttons.transmit.en || '', buttonsTransmitId: contact?.buttons.transmit.id || '',
    buttonsCopyUidEn: contact?.buttons.copyUid.en || '', buttonsCopyUidId: contact?.buttons.copyUid.id || '',
    github: contact?.socials.github || '', linkedin: contact?.socials.linkedin || '',
    instagram: contact?.socials.instagram || '', whatsapp: contact?.socials.whatsapp || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess(false); setSaving(true);
    try {
      await updateContactContent({
        headline: { en: form.headlineEn, id: form.headlineId },
        desc: { en: form.descEn, id: form.descId },
        email: form.email,
        labels: { title: { en: form.labelsTitleEn, id: form.labelsTitleId }, payload: { en: form.labelsPayloadEn, id: form.labelsPayloadId } },
        placeholders: { title: { en: form.placeholdersTitleEn, id: form.placeholdersTitleId }, payload: { en: form.placeholdersPayloadEn, id: form.placeholdersPayloadId } },
        buttons: { transmit: { en: form.buttonsTransmitEn, id: form.buttonsTransmitId }, copyUid: { en: form.buttonsCopyUidEn, id: form.buttonsCopyUidId } },
        socials: { github: form.github, linkedin: form.linkedin, instagram: form.instagram, whatsapp: form.whatsapp },
      });
      setSuccess(true); onSave(); setTimeout(() => setSuccess(false), 3000);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to save'); }
    finally { setSaving(false); }
  };

  const fieldPairs = [
    ['Headline (EN)', 'headlineEn', 'Headline (ID)', 'headlineId'],
  ] as const;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">{error}</div>}
      {success && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 text-sm">Contact content saved successfully</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><MobileLabel>Headline (EN)</MobileLabel><input value={form.headlineEn} onChange={e => setForm({...form, headlineEn: e.target.value})} placeholder="Headline (EN)" required className={inputClass} /></div>
        <div><MobileLabel>Headline (ID)</MobileLabel><input value={form.headlineId} onChange={e => setForm({...form, headlineId: e.target.value})} placeholder="Headline (ID)" required className={inputClass} /></div>
        <div><MobileLabel>Description (EN)</MobileLabel><textarea value={form.descEn} onChange={e => setForm({...form, descEn: e.target.value})} placeholder="Description (EN)" rows={2} required className={inputClass} /></div>
        <div><MobileLabel>Description (ID)</MobileLabel><textarea value={form.descId} onChange={e => setForm({...form, descId: e.target.value})} placeholder="Description (ID)" rows={2} required className={inputClass} /></div>
      </div>
      <div>
        <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Email</label>
        <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Contact email" required className={inputClass + " md:w-1/2"} />
      </div>
      {[
        { label: 'Form Labels', fields: [['labelsTitleEn','Title Label (EN)'],['labelsTitleId','Title Label (ID)'],['labelsPayloadEn','Payload Label (EN)'],['labelsPayloadId','Payload Label (ID)']] },
        { label: 'Placeholders', fields: [['placeholdersTitleEn','Title Placeholder (EN)'],['placeholdersTitleId','Title Placeholder (ID)'],['placeholdersPayloadEn','Payload Placeholder (EN)'],['placeholdersPayloadId','Payload Placeholder (ID)']] },
        { label: 'Buttons', fields: [['buttonsTransmitEn','Transmit Button (EN)'],['buttonsTransmitId','Transmit Button (ID)'],['buttonsCopyUidEn','Copy Button (EN)'],['buttonsCopyUidId','Copy Button (ID)']] },
        { label: 'Social Links', fields: [['github','GitHub URL'],['linkedin','LinkedIn URL'],['instagram','Instagram URL'],['whatsapp','WhatsApp URL']] },
      ].map(group => (
        <div key={group.label}>
          <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">{group.label}</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {group.fields.map(([key, ph]) => (
              <div key={key}>
                <MobileLabel>{ph}</MobileLabel>
                <input value={(form as Record<string, string>)[key]} onChange={e => setForm({...form, [key]: e.target.value})} placeholder={ph} required className={inputClass} />
              </div>
            ))}
          </div>
        </div>
      ))}
      <button type="submit" disabled={saving} className="w-full sm:w-auto px-6 py-2.5 lg:py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white text-sm font-bold rounded">{saving ? 'Saving...' : 'Save Contact'}</button>
    </form>
  );
}

function FooterForm({ footer, onSave }: { footer: FooterContent | null; onSave: () => void }) {
  const [form, setForm] = useState({
    ownerName: footer?.ownerName || '',
    roleEn: footer?.role.en || '', roleId: footer?.role.id || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess(false); setSaving(true);
    try {
      await updateFooterContent({ ownerName: form.ownerName, role: { en: form.roleEn, id: form.roleId } });
      setSuccess(true); onSave(); setTimeout(() => setSuccess(false), 3000);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to save'); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">{error}</div>}
      {success && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 text-sm">Footer content saved successfully</div>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div><MobileLabel>Owner Name</MobileLabel><input value={form.ownerName} onChange={e => setForm({...form, ownerName: e.target.value})} placeholder="Owner Name" required className={inputClass} /></div>
        <div><MobileLabel>Role (EN)</MobileLabel><input value={form.roleEn} onChange={e => setForm({...form, roleEn: e.target.value})} placeholder="Role (EN)" required className={inputClass} /></div>
        <div><MobileLabel>Role (ID)</MobileLabel><input value={form.roleId} onChange={e => setForm({...form, roleId: e.target.value})} placeholder="Role (ID)" required className={inputClass} /></div>
      </div>
      <button type="submit" disabled={saving} className="w-full sm:w-auto px-6 py-2.5 lg:py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white text-sm font-bold rounded">{saving ? 'Saving...' : 'Save Footer'}</button>
    </form>
  );
}

function HireBannerForm({ hireBanner, onSave }: { hireBanner: HireBannerContent | null; onSave: () => void }) {
  const [form, setForm] = useState({
    badgeEn: hireBanner?.badge.en || '', badgeId: hireBanner?.badge.id || '',
    headlineEn: hireBanner?.headline.en || '', headlineId: hireBanner?.headline.id || '',
    descEn: hireBanner?.desc.en || '', descId: hireBanner?.desc.id || '',
    ctaEn: hireBanner?.cta.en || '', ctaId: hireBanner?.cta.id || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess(false); setSaving(true);
    try {
      await updateHireBannerContent({
        badge: { en: form.badgeEn, id: form.badgeId },
        headline: { en: form.headlineEn, id: form.headlineId },
        desc: { en: form.descEn, id: form.descId },
        cta: { en: form.ctaEn, id: form.ctaId },
      });
      setSuccess(true); onSave(); setTimeout(() => setSuccess(false), 3000);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to save'); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">{error}</div>}
      {success && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 text-sm">Hire banner content saved successfully</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><MobileLabel>Badge (EN)</MobileLabel><input value={form.badgeEn} onChange={e => setForm({...form, badgeEn: e.target.value})} placeholder="Badge (EN)" required className={inputClass} /></div>
        <div><MobileLabel>Badge (ID)</MobileLabel><input value={form.badgeId} onChange={e => setForm({...form, badgeId: e.target.value})} placeholder="Badge (ID)" required className={inputClass} /></div>
        <div><MobileLabel>Headline (EN)</MobileLabel><input value={form.headlineEn} onChange={e => setForm({...form, headlineEn: e.target.value})} placeholder="Headline (EN)" required className={inputClass} /></div>
        <div><MobileLabel>Headline (ID)</MobileLabel><input value={form.headlineId} onChange={e => setForm({...form, headlineId: e.target.value})} placeholder="Headline (ID)" required className={inputClass} /></div>
        <div><MobileLabel>Description (EN)</MobileLabel><textarea value={form.descEn} onChange={e => setForm({...form, descEn: e.target.value})} placeholder="Description (EN)" rows={2} required className={inputClass} /></div>
        <div><MobileLabel>Description (ID)</MobileLabel><textarea value={form.descId} onChange={e => setForm({...form, descId: e.target.value})} placeholder="Description (ID)" rows={2} required className={inputClass} /></div>
        <div><MobileLabel>CTA Button (EN)</MobileLabel><input value={form.ctaEn} onChange={e => setForm({...form, ctaEn: e.target.value})} placeholder="CTA Button (EN)" required className={inputClass} /></div>
        <div><MobileLabel>CTA Button (ID)</MobileLabel><input value={form.ctaId} onChange={e => setForm({...form, ctaId: e.target.value})} placeholder="CTA Button (ID)" required className={inputClass} /></div>
      </div>
      <button type="submit" disabled={saving} className="w-full sm:w-auto px-6 py-2.5 lg:py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white text-sm font-bold rounded">{saving ? 'Saving...' : 'Save Hire Banner'}</button>
    </form>
  );
}

function NavbarForm({ navbar, onSave }: { navbar: NavbarContent | null; onSave: () => void }) {
  const [form, setForm] = useState({
    logoUrl: navbar?.logoUrl || '',
    brandInitials: navbar?.brandInitials || '',
    brandName: navbar?.brandName || '',
    aboutEn: navbar?.labels.about.en || '', aboutId: navbar?.labels.about.id || '',
    stackEn: navbar?.labels.stack.en || '', stackId: navbar?.labels.stack.id || '',
    experienceEn: navbar?.labels.experience.en || '', experienceId: navbar?.labels.experience.id || '',
    projectsEn: navbar?.labels.projects.en || '', projectsId: navbar?.labels.projects.id || '',
    blogEn: navbar?.labels.blog.en || '', blogId: navbar?.labels.blog.id || '',
    contactEn: navbar?.labels.contact.en || '', contactId: navbar?.labels.contact.id || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess(false); setSaving(true);
    try {
      await updateNavbarContent({
        logoUrl: form.logoUrl || undefined,
        brandInitials: form.brandInitials || undefined,
        brandName: form.brandName || undefined,
        labels: {
          about: { en: form.aboutEn, id: form.aboutId }, stack: { en: form.stackEn, id: form.stackId },
          experience: { en: form.experienceEn, id: form.experienceId }, projects: { en: form.projectsEn, id: form.projectsId },
          blog: { en: form.blogEn, id: form.blogId }, contact: { en: form.contactEn, id: form.contactId },
        },
      });
      setSuccess(true); onSave(); setTimeout(() => setSuccess(false), 3000);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to save'); }
    finally { setSaving(false); }
  };

  const navFields = [
    ['aboutEn','About (EN)','aboutId','About (ID)'],
    ['stackEn','Stack (EN)','stackId','Stack (ID)'],
    ['experienceEn','Experience (EN)','experienceId','Experience (ID)'],
    ['projectsEn','Projects (EN)','projectsId','Projects (ID)'],
    ['blogEn','Blog (EN)','blogId','Blog (ID)'],
    ['contactEn','Contact (EN)','contactId','Contact (ID)'],
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">{error}</div>}
      {success && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 text-sm">Navbar labels saved successfully</div>}
      <ImageUpload
        currentUrl={form.logoUrl}
        storagePath="brand/logo"
        onUpload={(url) => setForm({...form, logoUrl: url})}
        onRemove={() => setForm({...form, logoUrl: ''})}
        label="Brand Logo (used in Navbar & Footer)"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><MobileLabel>Brand Initials (fallback if no logo)</MobileLabel><input value={form.brandInitials} onChange={e => setForm({...form, brandInitials: e.target.value})} placeholder="Brand Initials (e.g. DC)" className={inputClass} /></div>
        <div><MobileLabel>Brand Name</MobileLabel><input value={form.brandName} onChange={e => setForm({...form, brandName: e.target.value})} placeholder="Brand Name (e.g. Daniansyah)" className={inputClass} /></div>
      </div>
      <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider">Nav Labels</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {navFields.map(([enKey, enPh, idKey, idPh]) => (
          <div key={enKey} className="contents">
            <div><MobileLabel>{enPh}</MobileLabel><input value={(form as Record<string, string>)[enKey]} onChange={e => setForm({...form, [enKey]: e.target.value})} placeholder={enPh} required className={inputClass} /></div>
            <div><MobileLabel>{idPh}</MobileLabel><input value={(form as Record<string, string>)[idKey]} onChange={e => setForm({...form, [idKey]: e.target.value})} placeholder={idPh} required className={inputClass} /></div>
          </div>
        ))}
      </div>
      <button type="submit" disabled={saving} className="w-full sm:w-auto px-6 py-2.5 lg:py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white text-sm font-bold rounded">{saving ? 'Saving...' : 'Save Navbar'}</button>
    </form>
  );
}
