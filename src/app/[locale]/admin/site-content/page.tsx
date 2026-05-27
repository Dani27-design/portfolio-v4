'use client';

import { useEffect, useState } from 'react';
import { updateHeroContent, updateAboutContent, updateContactContent, updateFooterContent, updateHireBannerContent, updateNavbarContent } from '@/actions/siteContent';
import type { HeroContent, AboutContent, ContactContent, FooterContent, HireBannerContent, NavbarContent } from '@/types';

export default function AdminSiteContentPage() {
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [contact, setContact] = useState<ContactContent | null>(null);
  const [footer, setFooter] = useState<FooterContent | null>(null);
  const [hireBanner, setHireBanner] = useState<HireBannerContent | null>(null);
  const [navbar, setNavbar] = useState<NavbarContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

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
      <h1 className="text-2xl font-bold text-white mb-8">Site Content</h1>

      {fetchError && (
        <div className="flex items-center justify-between p-3 mb-6 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
          <span>{fetchError}</span>
          <button onClick={fetchData} className="text-xs font-bold uppercase tracking-wider hover:text-red-300">Retry</button>
        </div>
      )}

      <div className="space-y-8">
        <HeroForm hero={hero} onSave={fetchData} />
        <AboutForm about={about} onSave={fetchData} />
        <ContactForm contact={contact} onSave={fetchData} />
        <FooterForm footer={footer} onSave={fetchData} />
        <HireBannerForm hireBanner={hireBanner} onSave={fetchData} />
        <NavbarForm navbar={navbar} onSave={fetchData} />
      </div>
    </div>
  );
}

function HeroForm({ hero, onSave }: { hero: HeroContent | null; onSave: () => void }) {
  const [form, setForm] = useState({
    taglineEn: hero?.tagline.en || '',
    taglineId: hero?.tagline.id || '',
    headlineEn: hero?.headline.en || '',
    headlineId: hero?.headline.id || '',
    descEn: hero?.desc.en || '',
    descId: hero?.desc.id || '',
    ctaGameEn: hero?.ctaGame.en || '',
    ctaGameId: hero?.ctaGame.id || '',
    ctaContactEn: hero?.ctaContact.en || '',
    ctaContactId: hero?.ctaContact.id || '',
    phrasesEn: hero?.phrases.en.join('\n') || '',
    phrasesId: hero?.phrases.id.join('\n') || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSaving(true);
    try {
      await updateHeroContent({
        tagline: { en: form.taglineEn, id: form.taglineId },
        headline: { en: form.headlineEn, id: form.headlineId },
        desc: { en: form.descEn, id: form.descId },
        ctaGame: { en: form.ctaGameEn, id: form.ctaGameId },
        ctaContact: { en: form.ctaContactEn, id: form.ctaContactId },
        phrases: {
          en: form.phrasesEn.split('\n').filter(Boolean),
          id: form.phrasesId.split('\n').filter(Boolean),
        },
      });
      setSuccess(true);
      onSave();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <h2 className="text-lg font-bold text-white mb-4">Hero Section</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">{error}</div>}
        {success && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 text-sm">Hero content saved successfully</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={form.taglineEn} onChange={e => setForm({...form, taglineEn: e.target.value})} placeholder="Tagline (EN)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          <input value={form.taglineId} onChange={e => setForm({...form, taglineId: e.target.value})} placeholder="Tagline (ID)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          <input value={form.headlineEn} onChange={e => setForm({...form, headlineEn: e.target.value})} placeholder="Headline (EN)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          <input value={form.headlineId} onChange={e => setForm({...form, headlineId: e.target.value})} placeholder="Headline (ID)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          <textarea value={form.descEn} onChange={e => setForm({...form, descEn: e.target.value})} placeholder="Description (EN)" rows={3} required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          <textarea value={form.descId} onChange={e => setForm({...form, descId: e.target.value})} placeholder="Description (ID)" rows={3} required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          <input value={form.ctaGameEn} onChange={e => setForm({...form, ctaGameEn: e.target.value})} placeholder="CTA Game (EN)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          <input value={form.ctaGameId} onChange={e => setForm({...form, ctaGameId: e.target.value})} placeholder="CTA Game (ID)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          <input value={form.ctaContactEn} onChange={e => setForm({...form, ctaContactEn: e.target.value})} placeholder="CTA Contact (EN)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          <input value={form.ctaContactId} onChange={e => setForm({...form, ctaContactId: e.target.value})} placeholder="CTA Contact (ID)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Typewriter Phrases (one per line)</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <textarea value={form.phrasesEn} onChange={e => setForm({...form, phrasesEn: e.target.value})} placeholder="Phrases EN (one per line)" rows={4} required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white font-mono outline-none focus:border-cyan-500" />
            <textarea value={form.phrasesId} onChange={e => setForm({...form, phrasesId: e.target.value})} placeholder="Phrases ID (one per line)" rows={4} required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white font-mono outline-none focus:border-cyan-500" />
          </div>
        </div>

        <button type="submit" disabled={saving} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white text-sm font-bold rounded">
          {saving ? 'Saving...' : 'Save Hero'}
        </button>
      </form>
    </div>
  );
}

function AboutForm({ about, onSave }: { about: AboutContent | null; onSave: () => void }) {
  const [form, setForm] = useState({
    titleEn: about?.title.en || '',
    titleId: about?.title.id || '',
    headlineEn: about?.headline.en || '',
    headlineId: about?.headline.id || '',
    descEn: about?.desc.en || '',
    descId: about?.desc.id || '',
    avatarInitials: about?.avatarInitials || '',
    stat1Value: about?.stats.stat1.value || '',
    stat1LabelEn: about?.stats.stat1.label.en || '',
    stat1LabelId: about?.stats.stat1.label.id || '',
    stat2Value: about?.stats.stat2.value || '',
    stat2LabelEn: about?.stats.stat2.label.en || '',
    stat2LabelId: about?.stats.stat2.label.id || '',
    stat3Value: about?.stats.stat3.value || '',
    stat3LabelEn: about?.stats.stat3.label.en || '',
    stat3LabelId: about?.stats.stat3.label.id || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSaving(true);
    try {
      await updateAboutContent({
        title: { en: form.titleEn, id: form.titleId },
        headline: { en: form.headlineEn, id: form.headlineId },
        desc: { en: form.descEn, id: form.descId },
        avatarInitials: form.avatarInitials,
        stats: {
          stat1: { value: form.stat1Value, label: { en: form.stat1LabelEn, id: form.stat1LabelId } },
          stat2: { value: form.stat2Value, label: { en: form.stat2LabelEn, id: form.stat2LabelId } },
          stat3: { value: form.stat3Value, label: { en: form.stat3LabelEn, id: form.stat3LabelId } },
        },
      });
      setSuccess(true);
      onSave();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <h2 className="text-lg font-bold text-white mb-4">About Section</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">{error}</div>}
        {success && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 text-sm">About content saved successfully</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={form.titleEn} onChange={e => setForm({...form, titleEn: e.target.value})} placeholder="Title Label (EN)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          <input value={form.titleId} onChange={e => setForm({...form, titleId: e.target.value})} placeholder="Title Label (ID)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          <input value={form.headlineEn} onChange={e => setForm({...form, headlineEn: e.target.value})} placeholder="Headline (EN)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          <input value={form.headlineId} onChange={e => setForm({...form, headlineId: e.target.value})} placeholder="Headline (ID)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          <textarea value={form.descEn} onChange={e => setForm({...form, descEn: e.target.value})} placeholder="Description (EN)" rows={3} required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          <textarea value={form.descId} onChange={e => setForm({...form, descId: e.target.value})} placeholder="Description (ID)" rows={3} required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
        </div>

        <div>
          <input value={form.avatarInitials} onChange={e => setForm({...form, avatarInitials: e.target.value})} placeholder="Avatar Initials (e.g. DC)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500 w-32" />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Stats</label>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input value={form.stat1Value} onChange={e => setForm({...form, stat1Value: e.target.value})} placeholder="Stat 1 Value (e.g. E2E)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
              <input value={form.stat1LabelEn} onChange={e => setForm({...form, stat1LabelEn: e.target.value})} placeholder="Stat 1 Label (EN)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
              <input value={form.stat1LabelId} onChange={e => setForm({...form, stat1LabelId: e.target.value})} placeholder="Stat 1 Label (ID)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input value={form.stat2Value} onChange={e => setForm({...form, stat2Value: e.target.value})} placeholder="Stat 2 Value (e.g. 0%)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
              <input value={form.stat2LabelEn} onChange={e => setForm({...form, stat2LabelEn: e.target.value})} placeholder="Stat 2 Label (EN)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
              <input value={form.stat2LabelId} onChange={e => setForm({...form, stat2LabelId: e.target.value})} placeholder="Stat 2 Label (ID)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input value={form.stat3Value} onChange={e => setForm({...form, stat3Value: e.target.value})} placeholder="Stat 3 Value (e.g. TDD)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
              <input value={form.stat3LabelEn} onChange={e => setForm({...form, stat3LabelEn: e.target.value})} placeholder="Stat 3 Label (EN)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
              <input value={form.stat3LabelId} onChange={e => setForm({...form, stat3LabelId: e.target.value})} placeholder="Stat 3 Label (ID)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white text-sm font-bold rounded">
          {saving ? 'Saving...' : 'Save About'}
        </button>
      </form>
    </div>
  );
}

function ContactForm({ contact, onSave }: { contact: ContactContent | null; onSave: () => void }) {
  const [form, setForm] = useState({
    headlineEn: contact?.headline.en || '',
    headlineId: contact?.headline.id || '',
    descEn: contact?.desc.en || '',
    descId: contact?.desc.id || '',
    email: contact?.email || '',
    labelsTitleEn: contact?.labels.title.en || '',
    labelsTitleId: contact?.labels.title.id || '',
    labelsPayloadEn: contact?.labels.payload.en || '',
    labelsPayloadId: contact?.labels.payload.id || '',
    placeholdersTitleEn: contact?.placeholders.title.en || '',
    placeholdersTitleId: contact?.placeholders.title.id || '',
    placeholdersPayloadEn: contact?.placeholders.payload.en || '',
    placeholdersPayloadId: contact?.placeholders.payload.id || '',
    buttonsTransmitEn: contact?.buttons.transmit.en || '',
    buttonsTransmitId: contact?.buttons.transmit.id || '',
    buttonsCopyUidEn: contact?.buttons.copyUid.en || '',
    buttonsCopyUidId: contact?.buttons.copyUid.id || '',
    github: contact?.socials.github || '',
    linkedin: contact?.socials.linkedin || '',
    instagram: contact?.socials.instagram || '',
    whatsapp: contact?.socials.whatsapp || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSaving(true);
    try {
      await updateContactContent({
        headline: { en: form.headlineEn, id: form.headlineId },
        desc: { en: form.descEn, id: form.descId },
        email: form.email,
        labels: {
          title: { en: form.labelsTitleEn, id: form.labelsTitleId },
          payload: { en: form.labelsPayloadEn, id: form.labelsPayloadId },
        },
        placeholders: {
          title: { en: form.placeholdersTitleEn, id: form.placeholdersTitleId },
          payload: { en: form.placeholdersPayloadEn, id: form.placeholdersPayloadId },
        },
        buttons: {
          transmit: { en: form.buttonsTransmitEn, id: form.buttonsTransmitId },
          copyUid: { en: form.buttonsCopyUidEn, id: form.buttonsCopyUidId },
        },
        socials: {
          github: form.github,
          linkedin: form.linkedin,
          instagram: form.instagram,
          whatsapp: form.whatsapp,
        },
      });
      setSuccess(true);
      onSave();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <h2 className="text-lg font-bold text-white mb-4">Contact Section</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">{error}</div>}
        {success && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 text-sm">Contact content saved successfully</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={form.headlineEn} onChange={e => setForm({...form, headlineEn: e.target.value})} placeholder="Headline (EN)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          <input value={form.headlineId} onChange={e => setForm({...form, headlineId: e.target.value})} placeholder="Headline (ID)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          <textarea value={form.descEn} onChange={e => setForm({...form, descEn: e.target.value})} placeholder="Description (EN)" rows={2} required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          <textarea value={form.descId} onChange={e => setForm({...form, descId: e.target.value})} placeholder="Description (ID)" rows={2} required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Email</label>
          <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Contact email" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500 w-full md:w-1/2" />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Form Labels</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={form.labelsTitleEn} onChange={e => setForm({...form, labelsTitleEn: e.target.value})} placeholder="Title Label (EN)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
            <input value={form.labelsTitleId} onChange={e => setForm({...form, labelsTitleId: e.target.value})} placeholder="Title Label (ID)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
            <input value={form.labelsPayloadEn} onChange={e => setForm({...form, labelsPayloadEn: e.target.value})} placeholder="Payload Label (EN)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
            <input value={form.labelsPayloadId} onChange={e => setForm({...form, labelsPayloadId: e.target.value})} placeholder="Payload Label (ID)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Placeholders</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={form.placeholdersTitleEn} onChange={e => setForm({...form, placeholdersTitleEn: e.target.value})} placeholder="Title Placeholder (EN)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
            <input value={form.placeholdersTitleId} onChange={e => setForm({...form, placeholdersTitleId: e.target.value})} placeholder="Title Placeholder (ID)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
            <input value={form.placeholdersPayloadEn} onChange={e => setForm({...form, placeholdersPayloadEn: e.target.value})} placeholder="Payload Placeholder (EN)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
            <input value={form.placeholdersPayloadId} onChange={e => setForm({...form, placeholdersPayloadId: e.target.value})} placeholder="Payload Placeholder (ID)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Buttons</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={form.buttonsTransmitEn} onChange={e => setForm({...form, buttonsTransmitEn: e.target.value})} placeholder="Transmit Button (EN)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
            <input value={form.buttonsTransmitId} onChange={e => setForm({...form, buttonsTransmitId: e.target.value})} placeholder="Transmit Button (ID)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
            <input value={form.buttonsCopyUidEn} onChange={e => setForm({...form, buttonsCopyUidEn: e.target.value})} placeholder="Copy Button (EN)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
            <input value={form.buttonsCopyUidId} onChange={e => setForm({...form, buttonsCopyUidId: e.target.value})} placeholder="Copy Button (ID)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Social Links</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={form.github} onChange={e => setForm({...form, github: e.target.value})} placeholder="GitHub URL" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
            <input value={form.linkedin} onChange={e => setForm({...form, linkedin: e.target.value})} placeholder="LinkedIn URL" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
            <input value={form.instagram} onChange={e => setForm({...form, instagram: e.target.value})} placeholder="Instagram URL" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
            <input value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} placeholder="WhatsApp URL" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          </div>
        </div>

        <button type="submit" disabled={saving} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white text-sm font-bold rounded">
          {saving ? 'Saving...' : 'Save Contact'}
        </button>
      </form>
    </div>
  );
}

function FooterForm({ footer, onSave }: { footer: FooterContent | null; onSave: () => void }) {
  const [form, setForm] = useState({
    ownerName: footer?.ownerName || '',
    roleEn: footer?.role.en || '',
    roleId: footer?.role.id || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSaving(true);
    try {
      await updateFooterContent({
        ownerName: form.ownerName,
        role: { en: form.roleEn, id: form.roleId },
      });
      setSuccess(true);
      onSave();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <h2 className="text-lg font-bold text-white mb-4">Footer</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">{error}</div>}
        {success && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 text-sm">Footer content saved successfully</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input value={form.ownerName} onChange={e => setForm({...form, ownerName: e.target.value})} placeholder="Owner Name" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          <input value={form.roleEn} onChange={e => setForm({...form, roleEn: e.target.value})} placeholder="Role (EN)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          <input value={form.roleId} onChange={e => setForm({...form, roleId: e.target.value})} placeholder="Role (ID)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
        </div>

        <button type="submit" disabled={saving} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white text-sm font-bold rounded">
          {saving ? 'Saving...' : 'Save Footer'}
        </button>
      </form>
    </div>
  );
}

function HireBannerForm({ hireBanner, onSave }: { hireBanner: HireBannerContent | null; onSave: () => void }) {
  const [form, setForm] = useState({
    badgeEn: hireBanner?.badge.en || '',
    badgeId: hireBanner?.badge.id || '',
    headlineEn: hireBanner?.headline.en || '',
    headlineId: hireBanner?.headline.id || '',
    descEn: hireBanner?.desc.en || '',
    descId: hireBanner?.desc.id || '',
    ctaEn: hireBanner?.cta.en || '',
    ctaId: hireBanner?.cta.id || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSaving(true);
    try {
      await updateHireBannerContent({
        badge: { en: form.badgeEn, id: form.badgeId },
        headline: { en: form.headlineEn, id: form.headlineId },
        desc: { en: form.descEn, id: form.descId },
        cta: { en: form.ctaEn, id: form.ctaId },
      });
      setSuccess(true);
      onSave();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <h2 className="text-lg font-bold text-white mb-4">Hire Me Banner</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">{error}</div>}
        {success && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 text-sm">Hire banner content saved successfully</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={form.badgeEn} onChange={e => setForm({...form, badgeEn: e.target.value})} placeholder="Badge (EN)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          <input value={form.badgeId} onChange={e => setForm({...form, badgeId: e.target.value})} placeholder="Badge (ID)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          <input value={form.headlineEn} onChange={e => setForm({...form, headlineEn: e.target.value})} placeholder="Headline (EN)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          <input value={form.headlineId} onChange={e => setForm({...form, headlineId: e.target.value})} placeholder="Headline (ID)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          <textarea value={form.descEn} onChange={e => setForm({...form, descEn: e.target.value})} placeholder="Description (EN)" rows={2} required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          <textarea value={form.descId} onChange={e => setForm({...form, descId: e.target.value})} placeholder="Description (ID)" rows={2} required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          <input value={form.ctaEn} onChange={e => setForm({...form, ctaEn: e.target.value})} placeholder="CTA Button (EN)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          <input value={form.ctaId} onChange={e => setForm({...form, ctaId: e.target.value})} placeholder="CTA Button (ID)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
        </div>

        <button type="submit" disabled={saving} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white text-sm font-bold rounded">
          {saving ? 'Saving...' : 'Save Hire Banner'}
        </button>
      </form>
    </div>
  );
}

function NavbarForm({ navbar, onSave }: { navbar: NavbarContent | null; onSave: () => void }) {
  const [form, setForm] = useState({
    aboutEn: navbar?.labels.about.en || '',
    aboutId: navbar?.labels.about.id || '',
    stackEn: navbar?.labels.stack.en || '',
    stackId: navbar?.labels.stack.id || '',
    experienceEn: navbar?.labels.experience.en || '',
    experienceId: navbar?.labels.experience.id || '',
    projectsEn: navbar?.labels.projects.en || '',
    projectsId: navbar?.labels.projects.id || '',
    blogEn: navbar?.labels.blog.en || '',
    blogId: navbar?.labels.blog.id || '',
    contactEn: navbar?.labels.contact.en || '',
    contactId: navbar?.labels.contact.id || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSaving(true);
    try {
      await updateNavbarContent({
        labels: {
          about: { en: form.aboutEn, id: form.aboutId },
          stack: { en: form.stackEn, id: form.stackId },
          experience: { en: form.experienceEn, id: form.experienceId },
          projects: { en: form.projectsEn, id: form.projectsId },
          blog: { en: form.blogEn, id: form.blogId },
          contact: { en: form.contactEn, id: form.contactId },
        },
      });
      setSuccess(true);
      onSave();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <h2 className="text-lg font-bold text-white mb-4">Navbar Labels</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">{error}</div>}
        {success && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 text-sm">Navbar labels saved successfully</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={form.aboutEn} onChange={e => setForm({...form, aboutEn: e.target.value})} placeholder="About (EN)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          <input value={form.aboutId} onChange={e => setForm({...form, aboutId: e.target.value})} placeholder="About (ID)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          <input value={form.stackEn} onChange={e => setForm({...form, stackEn: e.target.value})} placeholder="Stack (EN)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          <input value={form.stackId} onChange={e => setForm({...form, stackId: e.target.value})} placeholder="Stack (ID)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          <input value={form.experienceEn} onChange={e => setForm({...form, experienceEn: e.target.value})} placeholder="Experience (EN)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          <input value={form.experienceId} onChange={e => setForm({...form, experienceId: e.target.value})} placeholder="Experience (ID)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          <input value={form.projectsEn} onChange={e => setForm({...form, projectsEn: e.target.value})} placeholder="Projects (EN)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          <input value={form.projectsId} onChange={e => setForm({...form, projectsId: e.target.value})} placeholder="Projects (ID)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          <input value={form.blogEn} onChange={e => setForm({...form, blogEn: e.target.value})} placeholder="Blog (EN)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          <input value={form.blogId} onChange={e => setForm({...form, blogId: e.target.value})} placeholder="Blog (ID)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          <input value={form.contactEn} onChange={e => setForm({...form, contactEn: e.target.value})} placeholder="Contact (EN)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          <input value={form.contactId} onChange={e => setForm({...form, contactId: e.target.value})} placeholder="Contact (ID)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
        </div>

        <button type="submit" disabled={saving} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white text-sm font-bold rounded">
          {saving ? 'Saving...' : 'Save Navbar'}
        </button>
      </form>
    </div>
  );
}
