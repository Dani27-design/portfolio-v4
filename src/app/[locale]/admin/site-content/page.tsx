'use client';

import { useCallback, useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { AdminToast, type Toast } from '@/components/admin/AdminToast';
import { updateHeroContent, updateAboutContent, updateContactContent, updateFooterContent, updateHireBannerContent, updateNavbarContent } from '@/actions/siteContent';
import type { HeroContent, AboutContent, ContactContent, FooterContent, HireBannerContent, NavbarContent } from '@/types';

const inputClass = "bg-slate-900 border border-slate-600 rounded px-3 py-2.5 lg:py-2 text-sm text-white outline-none focus:border-cyan-500 w-full";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs text-slate-400 mb-1">{children}</label>;
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
  const [toast, setToast] = useState<Toast | null>(null);
  const dismissToast = useCallback(() => setToast(null), []);
  const onSaveSuccess = (msg: string) => { setToast({ type: 'success', message: msg }); fetchData(); };
  const onSaveError = (msg: string) => setToast({ type: 'error', message: msg });

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
      <AdminToast toast={toast} onDismiss={dismissToast} />
      <h1 className="text-xl lg:text-2xl font-bold text-white mb-6 lg:mb-8">Site Content</h1>

      {fetchError && (
        <div className="flex items-center justify-between p-3 mb-6 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
          <span>{fetchError}</span>
          <button onClick={fetchData} className="text-xs font-bold uppercase tracking-wider hover:text-red-300">Retry</button>
        </div>
      )}

      <div className="space-y-4 lg:space-y-8">
        <SectionCard id="hero" title="Hero Section" openSection={openSection} setOpenSection={setOpenSection}>
          <HeroForm hero={hero} onSave={onSaveSuccess} onError={onSaveError} />
        </SectionCard>
        <SectionCard id="about" title="About Section" openSection={openSection} setOpenSection={setOpenSection}>
          <AboutForm about={about} onSave={onSaveSuccess} onError={onSaveError} />
        </SectionCard>
        <SectionCard id="contact" title="Contact Section" openSection={openSection} setOpenSection={setOpenSection}>
          <ContactForm contact={contact} onSave={onSaveSuccess} onError={onSaveError} />
        </SectionCard>
        <SectionCard id="footer" title="Footer" openSection={openSection} setOpenSection={setOpenSection}>
          <FooterForm footer={footer} onSave={onSaveSuccess} onError={onSaveError} />
        </SectionCard>
        <SectionCard id="hireBanner" title="Hire Me Banner" openSection={openSection} setOpenSection={setOpenSection}>
          <HireBannerForm hireBanner={hireBanner} onSave={onSaveSuccess} onError={onSaveError} />
        </SectionCard>
        <SectionCard id="navbar" title="Navbar Labels" openSection={openSection} setOpenSection={setOpenSection}>
          <NavbarForm navbar={navbar} onSave={onSaveSuccess} onError={onSaveError} />
        </SectionCard>
      </div>
    </div>
  );
}

function HeroForm({ hero, onSave, onError }: { hero: HeroContent | null; onSave: (msg: string) => void; onError: (msg: string) => void }) {
  const [form, setForm] = useState({
    taglineEn: hero?.tagline.en || '', taglineId: hero?.tagline.id || '',
    headlineEn: hero?.headline.en || '', headlineId: hero?.headline.id || '',
    descEn: hero?.desc.en || '', descId: hero?.desc.id || '',
    ctaGameEn: hero?.ctaGame.en || '', ctaGameId: hero?.ctaGame.id || '',
    ctaContactEn: hero?.ctaContact.en || '', ctaContactId: hero?.ctaContact.id || '',
    phrasesEn: hero?.phrases.en.join('\n') || '', phrasesId: hero?.phrases.id.join('\n') || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateHeroContent({
        tagline: { en: form.taglineEn, id: form.taglineId },
        headline: { en: form.headlineEn, id: form.headlineId },
        desc: { en: form.descEn, id: form.descId },
        ctaGame: { en: form.ctaGameEn, id: form.ctaGameId },
        ctaContact: { en: form.ctaContactEn, id: form.ctaContactId },
        phrases: { en: form.phrasesEn.split('\n').filter(Boolean), id: form.phrasesId.split('\n').filter(Boolean) },
      });
      onSave('Hero content saved successfully');
    } catch (err) { onError(err instanceof Error ? err.message : 'Failed to save'); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div><FieldLabel>Tagline (EN)</FieldLabel><input value={form.taglineEn} onChange={e => setForm({...form, taglineEn: e.target.value})} placeholder="Tagline (EN)" required className={inputClass} /></div>
      <div><FieldLabel>Tagline (ID)</FieldLabel><input value={form.taglineId} onChange={e => setForm({...form, taglineId: e.target.value})} placeholder="Tagline (ID)" required className={inputClass} /></div>
      <div><FieldLabel>Headline (EN)</FieldLabel><input value={form.headlineEn} onChange={e => setForm({...form, headlineEn: e.target.value})} placeholder="Headline (EN)" required className={inputClass} /></div>
      <div><FieldLabel>Headline (ID)</FieldLabel><input value={form.headlineId} onChange={e => setForm({...form, headlineId: e.target.value})} placeholder="Headline (ID)" required className={inputClass} /></div>
      <div><FieldLabel>Description (EN)</FieldLabel><textarea value={form.descEn} onChange={e => setForm({...form, descEn: e.target.value})} placeholder="Description (EN)" rows={3} required className={inputClass} /></div>
      <div><FieldLabel>Description (ID)</FieldLabel><textarea value={form.descId} onChange={e => setForm({...form, descId: e.target.value})} placeholder="Description (ID)" rows={3} required className={inputClass} /></div>
      <div><FieldLabel>CTA Game (EN)</FieldLabel><input value={form.ctaGameEn} onChange={e => setForm({...form, ctaGameEn: e.target.value})} placeholder="CTA Game (EN)" required className={inputClass} /></div>
      <div><FieldLabel>CTA Game (ID)</FieldLabel><input value={form.ctaGameId} onChange={e => setForm({...form, ctaGameId: e.target.value})} placeholder="CTA Game (ID)" required className={inputClass} /></div>
      <div><FieldLabel>CTA Contact (EN)</FieldLabel><input value={form.ctaContactEn} onChange={e => setForm({...form, ctaContactEn: e.target.value})} placeholder="CTA Contact (EN)" required className={inputClass} /></div>
      <div><FieldLabel>CTA Contact (ID)</FieldLabel><input value={form.ctaContactId} onChange={e => setForm({...form, ctaContactId: e.target.value})} placeholder="CTA Contact (ID)" required className={inputClass} /></div>
      <div className="md:col-span-2">
        <FieldLabel>Typewriter Phrases (one per line)</FieldLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <textarea value={form.phrasesEn} onChange={e => setForm({...form, phrasesEn: e.target.value})} placeholder="Phrases EN (one per line)" rows={4} required className={inputClass + " font-mono"} />
          <textarea value={form.phrasesId} onChange={e => setForm({...form, phrasesId: e.target.value})} placeholder="Phrases ID (one per line)" rows={4} required className={inputClass + " font-mono"} />
        </div>
      </div>
      <div className="md:col-span-2">
        <button type="submit" disabled={saving} className="w-full sm:w-auto px-6 py-2.5 lg:py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white text-sm font-bold rounded">{saving ? 'Saving...' : 'Save'}</button>
      </div>
    </form>
  );
}

function AboutForm({ about, onSave, onError }: { about: AboutContent | null; onSave: (msg: string) => void; onError: (msg: string) => void }) {
  const [form, setForm] = useState({
    titleEn: about?.title.en || '', titleId: about?.title.id || '',
    headlineEn: about?.headline.en || '', headlineId: about?.headline.id || '',
    descEn: about?.desc.en || '', descId: about?.desc.id || '',
    avatarUrl: about?.avatarUrl || '',
    stat1Value: about?.stats.stat1.value || '', stat1LabelEn: about?.stats.stat1.label.en || '', stat1LabelId: about?.stats.stat1.label.id || '',
    stat2Value: about?.stats.stat2.value || '', stat2LabelEn: about?.stats.stat2.label.en || '', stat2LabelId: about?.stats.stat2.label.id || '',
    stat3Value: about?.stats.stat3.value || '', stat3LabelEn: about?.stats.stat3.label.en || '', stat3LabelId: about?.stats.stat3.label.id || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateAboutContent({
        title: { en: form.titleEn, id: form.titleId },
        headline: { en: form.headlineEn, id: form.headlineId },
        desc: { en: form.descEn, id: form.descId },
        avatarUrl: form.avatarUrl || undefined,
        stats: {
          stat1: { value: form.stat1Value, label: { en: form.stat1LabelEn, id: form.stat1LabelId } },
          stat2: { value: form.stat2Value, label: { en: form.stat2LabelEn, id: form.stat2LabelId } },
          stat3: { value: form.stat3Value, label: { en: form.stat3LabelEn, id: form.stat3LabelId } },
        },
      });
      onSave('About content saved successfully');
    } catch (err) { onError(err instanceof Error ? err.message : 'Failed to save'); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div><FieldLabel>Title Label (EN)</FieldLabel><input value={form.titleEn} onChange={e => setForm({...form, titleEn: e.target.value})} placeholder="Title Label (EN)" required className={inputClass} /></div>
      <div><FieldLabel>Title Label (ID)</FieldLabel><input value={form.titleId} onChange={e => setForm({...form, titleId: e.target.value})} placeholder="Title Label (ID)" required className={inputClass} /></div>
      <div><FieldLabel>Headline (EN)</FieldLabel><input value={form.headlineEn} onChange={e => setForm({...form, headlineEn: e.target.value})} placeholder="Headline (EN)" required className={inputClass} /></div>
      <div><FieldLabel>Headline (ID)</FieldLabel><input value={form.headlineId} onChange={e => setForm({...form, headlineId: e.target.value})} placeholder="Headline (ID)" required className={inputClass} /></div>
      <div><FieldLabel>Description (EN)</FieldLabel><textarea value={form.descEn} onChange={e => setForm({...form, descEn: e.target.value})} placeholder="Description (EN)" rows={3} required className={inputClass} /></div>
      <div><FieldLabel>Description (ID)</FieldLabel><textarea value={form.descId} onChange={e => setForm({...form, descId: e.target.value})} placeholder="Description (ID)" rows={3} required className={inputClass} /></div>
      <div className="md:col-span-2">
        <ImageUpload
          currentUrl={form.avatarUrl}
          storagePath="brand/avatar"
          onUpload={(url) => setForm({...form, avatarUrl: url})}
          onRemove={() => setForm({...form, avatarUrl: ''})}
          label="Avatar Image"
        />
      </div>
      <div className="md:col-span-2">
        <FieldLabel>Stats</FieldLabel>
        <div className="space-y-3">
          {[
            { label: 'Stat 1', vKey: 'stat1Value' as const, enKey: 'stat1LabelEn' as const, idKey: 'stat1LabelId' as const, vPh: 'e.g. E2E' },
            { label: 'Stat 2', vKey: 'stat2Value' as const, enKey: 'stat2LabelEn' as const, idKey: 'stat2LabelId' as const, vPh: 'e.g. 0%' },
            { label: 'Stat 3', vKey: 'stat3Value' as const, enKey: 'stat3LabelEn' as const, idKey: 'stat3LabelId' as const, vPh: 'e.g. TDD' },
          ].map(s => (
            <div key={s.label} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><FieldLabel>{s.label} Value</FieldLabel><input value={form[s.vKey]} onChange={e => setForm({...form, [s.vKey]: e.target.value})} placeholder={`${s.label} Value (${s.vPh})`} required className={inputClass} /></div>
              <div><FieldLabel>{s.label} Label (EN)</FieldLabel><input value={form[s.enKey]} onChange={e => setForm({...form, [s.enKey]: e.target.value})} placeholder={`${s.label} Label (EN)`} required className={inputClass} /></div>
              <div><FieldLabel>{s.label} Label (ID)</FieldLabel><input value={form[s.idKey]} onChange={e => setForm({...form, [s.idKey]: e.target.value})} placeholder={`${s.label} Label (ID)`} required className={inputClass} /></div>
            </div>
          ))}
        </div>
      </div>
      <div className="md:col-span-2">
        <button type="submit" disabled={saving} className="w-full sm:w-auto px-6 py-2.5 lg:py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white text-sm font-bold rounded">{saving ? 'Saving...' : 'Save'}</button>
      </div>
    </form>
  );
}

function ContactForm({ contact, onSave, onError }: { contact: ContactContent | null; onSave: (msg: string) => void; onError: (msg: string) => void }) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
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
      onSave('Contact content saved successfully');
    } catch (err) { onError(err instanceof Error ? err.message : 'Failed to save'); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div><FieldLabel>Headline (EN)</FieldLabel><input value={form.headlineEn} onChange={e => setForm({...form, headlineEn: e.target.value})} placeholder="Headline (EN)" required className={inputClass} /></div>
      <div><FieldLabel>Headline (ID)</FieldLabel><input value={form.headlineId} onChange={e => setForm({...form, headlineId: e.target.value})} placeholder="Headline (ID)" required className={inputClass} /></div>
      <div><FieldLabel>Description (EN)</FieldLabel><textarea value={form.descEn} onChange={e => setForm({...form, descEn: e.target.value})} placeholder="Description (EN)" rows={2} required className={inputClass} /></div>
      <div><FieldLabel>Description (ID)</FieldLabel><textarea value={form.descId} onChange={e => setForm({...form, descId: e.target.value})} placeholder="Description (ID)" rows={2} required className={inputClass} /></div>
      <div className="md:col-span-2">
        <FieldLabel>Email</FieldLabel>
        <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Contact email" required className={inputClass} />
      </div>
      {[
        { label: 'Form Labels', fields: [['labelsTitleEn','Title Label (EN)'],['labelsTitleId','Title Label (ID)'],['labelsPayloadEn','Payload Label (EN)'],['labelsPayloadId','Payload Label (ID)']] },
        { label: 'Placeholders', fields: [['placeholdersTitleEn','Title Placeholder (EN)'],['placeholdersTitleId','Title Placeholder (ID)'],['placeholdersPayloadEn','Payload Placeholder (EN)'],['placeholdersPayloadId','Payload Placeholder (ID)']] },
        { label: 'Buttons', fields: [['buttonsTransmitEn','Transmit Button (EN)'],['buttonsTransmitId','Transmit Button (ID)'],['buttonsCopyUidEn','Copy Button (EN)'],['buttonsCopyUidId','Copy Button (ID)']] },
        { label: 'Social Links', fields: [['github','GitHub URL'],['linkedin','LinkedIn URL'],['instagram','Instagram URL'],['whatsapp','WhatsApp URL']] },
      ].map(group => (
        <div key={group.label} className="md:col-span-2">
          <FieldLabel>{group.label}</FieldLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {group.fields.map(([key, ph]) => (
              <div key={key}>
                <FieldLabel>{ph}</FieldLabel>
                <input value={(form as Record<string, string>)[key]} onChange={e => setForm({...form, [key]: e.target.value})} placeholder={ph} required className={inputClass} />
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="md:col-span-2">
        <button type="submit" disabled={saving} className="w-full sm:w-auto px-6 py-2.5 lg:py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white text-sm font-bold rounded">{saving ? 'Saving...' : 'Save'}</button>
      </div>
    </form>
  );
}

function FooterForm({ footer, onSave, onError }: { footer: FooterContent | null; onSave: (msg: string) => void; onError: (msg: string) => void }) {
  const [form, setForm] = useState({
    ownerName: footer?.ownerName || '',
    roleEn: footer?.role.en || '', roleId: footer?.role.id || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateFooterContent({ ownerName: form.ownerName, role: { en: form.roleEn, id: form.roleId } });
      onSave('Footer content saved successfully');
    } catch (err) { onError(err instanceof Error ? err.message : 'Failed to save'); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2"><FieldLabel>Owner Name</FieldLabel><input value={form.ownerName} onChange={e => setForm({...form, ownerName: e.target.value})} placeholder="Owner Name" required className={inputClass} /></div>
      <div><FieldLabel>Role (EN)</FieldLabel><input value={form.roleEn} onChange={e => setForm({...form, roleEn: e.target.value})} placeholder="Role (EN)" required className={inputClass} /></div>
      <div><FieldLabel>Role (ID)</FieldLabel><input value={form.roleId} onChange={e => setForm({...form, roleId: e.target.value})} placeholder="Role (ID)" required className={inputClass} /></div>
      <div className="md:col-span-2">
        <button type="submit" disabled={saving} className="w-full sm:w-auto px-6 py-2.5 lg:py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white text-sm font-bold rounded">{saving ? 'Saving...' : 'Save'}</button>
      </div>
    </form>
  );
}

function HireBannerForm({ hireBanner, onSave, onError }: { hireBanner: HireBannerContent | null; onSave: (msg: string) => void; onError: (msg: string) => void }) {
  const [form, setForm] = useState({
    headlineEn: hireBanner?.headline.en || '', headlineId: hireBanner?.headline.id || '',
    descEn: hireBanner?.desc.en || '', descId: hireBanner?.desc.id || '',
    ctaEn: hireBanner?.cta.en || '', ctaId: hireBanner?.cta.id || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateHireBannerContent({
        headline: { en: form.headlineEn, id: form.headlineId },
        desc: { en: form.descEn, id: form.descId },
        cta: { en: form.ctaEn, id: form.ctaId },
      });
      onSave('Hire banner content saved successfully');
    } catch (err) { onError(err instanceof Error ? err.message : 'Failed to save'); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div><FieldLabel>Headline (EN)</FieldLabel><input value={form.headlineEn} onChange={e => setForm({...form, headlineEn: e.target.value})} placeholder="Headline (EN)" required className={inputClass} /></div>
      <div><FieldLabel>Headline (ID)</FieldLabel><input value={form.headlineId} onChange={e => setForm({...form, headlineId: e.target.value})} placeholder="Headline (ID)" required className={inputClass} /></div>
      <div><FieldLabel>Description (EN)</FieldLabel><textarea value={form.descEn} onChange={e => setForm({...form, descEn: e.target.value})} placeholder="Description (EN)" rows={2} required className={inputClass} /></div>
      <div><FieldLabel>Description (ID)</FieldLabel><textarea value={form.descId} onChange={e => setForm({...form, descId: e.target.value})} placeholder="Description (ID)" rows={2} required className={inputClass} /></div>
      <div><FieldLabel>CTA Button (EN)</FieldLabel><input value={form.ctaEn} onChange={e => setForm({...form, ctaEn: e.target.value})} placeholder="CTA Button (EN)" required className={inputClass} /></div>
      <div><FieldLabel>CTA Button (ID)</FieldLabel><input value={form.ctaId} onChange={e => setForm({...form, ctaId: e.target.value})} placeholder="CTA Button (ID)" required className={inputClass} /></div>
      <div className="md:col-span-2">
        <button type="submit" disabled={saving} className="w-full sm:w-auto px-6 py-2.5 lg:py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white text-sm font-bold rounded">{saving ? 'Saving...' : 'Save'}</button>
      </div>
    </form>
  );
}

function NavbarForm({ navbar, onSave, onError }: { navbar: NavbarContent | null; onSave: (msg: string) => void; onError: (msg: string) => void }) {
  const [form, setForm] = useState({
    logoUrl: navbar?.logoUrl || '',
    brandName: navbar?.brandName || '',
    aboutEn: navbar?.labels.about.en || '', aboutId: navbar?.labels.about.id || '',
    stackEn: navbar?.labels.stack.en || '', stackId: navbar?.labels.stack.id || '',
    experienceEn: navbar?.labels.experience.en || '', experienceId: navbar?.labels.experience.id || '',
    projectsEn: navbar?.labels.projects.en || '', projectsId: navbar?.labels.projects.id || '',
    blogEn: navbar?.labels.blog.en || '', blogId: navbar?.labels.blog.id || '',
    contactEn: navbar?.labels.contact.en || '', contactId: navbar?.labels.contact.id || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateNavbarContent({
        logoUrl: form.logoUrl || undefined,
        brandName: form.brandName || undefined,
        labels: {
          about: { en: form.aboutEn, id: form.aboutId }, stack: { en: form.stackEn, id: form.stackId },
          experience: { en: form.experienceEn, id: form.experienceId }, projects: { en: form.projectsEn, id: form.projectsId },
          blog: { en: form.blogEn, id: form.blogId }, contact: { en: form.contactEn, id: form.contactId },
        },
      });
      onSave('Navbar labels saved successfully');
    } catch (err) { onError(err instanceof Error ? err.message : 'Failed to save'); }
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
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <ImageUpload
          currentUrl={form.logoUrl}
          storagePath="brand/logo"
          onUpload={(url) => setForm({...form, logoUrl: url})}
          onRemove={() => setForm({...form, logoUrl: ''})}
          label="Brand Logo (used in Navbar & Footer)"
        />
      </div>
      <div className="md:col-span-2">
        <FieldLabel>Brand Name</FieldLabel>
        <input value={form.brandName} onChange={e => setForm({...form, brandName: e.target.value})} placeholder="Brand Name (e.g. Daniansyah)" className={inputClass} />
      </div>
      <div className="md:col-span-2">
        <FieldLabel>Nav Labels</FieldLabel>
      </div>
      {navFields.map(([enKey, enPh, idKey, idPh]) => (
        <div key={enKey} className="contents">
          <div><FieldLabel>{enPh}</FieldLabel><input value={(form as Record<string, string>)[enKey]} onChange={e => setForm({...form, [enKey]: e.target.value})} placeholder={enPh} required className={inputClass} /></div>
          <div><FieldLabel>{idPh}</FieldLabel><input value={(form as Record<string, string>)[idKey]} onChange={e => setForm({...form, [idKey]: e.target.value})} placeholder={idPh} required className={inputClass} /></div>
        </div>
      ))}
      <div className="md:col-span-2">
        <button type="submit" disabled={saving} className="w-full sm:w-auto px-6 py-2.5 lg:py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white text-sm font-bold rounded">{saving ? 'Saving...' : 'Save'}</button>
      </div>
    </form>
  );
}
