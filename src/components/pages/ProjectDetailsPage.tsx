import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { ClientGimmick } from "@/components/ui/ClientGimmick";
import { HireMeBanner } from "@/components/ui/HireMeBanner";
import { CodeText } from "@/components/ui/CodeText";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Markdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import { getTranslations } from "next-intl/server";
import type { Project, Locale, HireBannerContent } from "@/types";

interface ProjectDetailsPageProps {
  project: Project;
  locale: string;
  hireBannerContent?: HireBannerContent | null;
}

export async function ProjectDetailsPage({ project, locale, hireBannerContent }: ProjectDetailsPageProps) {
  const t = await getTranslations('projects');
  const loc = locale as Locale;

  return (
    <section className="pb-8 md:pb-14 bg-surface relative min-h-screen overflow-hidden pt-24 md:pt-28">
      <ClientGimmick name="serviceCluster" />

      <div className="container-custom relative z-10">
        <Reveal width="100%">
          <div className="mb-6 md:mb-10">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-cyan-500 transition-colors mb-6"
              aria-label={t('backToProjects')}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-mono text-xs uppercase tracking-wider">{t('backToProjects')}</span>
            </Link>

            <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold text-text-main tracking-tighter leading-tight break-words">
              <CodeText tag="h1" type="html">{project.name[loc]}</CodeText>
            </h1>

            <p className="text-text-muted text-sm md:text-lg mt-3 md:mt-4 max-w-3xl leading-relaxed">
              {project.desc[loc]}
            </p>

            {/* CTA */}
            {project.url && (
              <div className="mt-5 md:mt-6">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-background bg-cyan-500 hover:bg-cyan-600 transition-colors rounded-lg px-4 py-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {t('visitProject')}
                </a>
              </div>
            )}
          </div>
        </Reveal>

        {/* Media: image or autoplay video */}
        {(project.image || project.videoUrl) && (
          <Reveal delay={0.1} width="100%">
            <div className="mb-8 md:mb-12 rounded-xl overflow-hidden border border-border/40 bg-background relative aspect-video">
              {project.videoUrl ? (
                <video
                  src={project.videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  aria-label={project.name[loc]}
                  className="w-full h-full object-cover"
                />
              ) : project.image ? (
                <Image
                  src={project.image}
                  alt={project.name[loc]}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 1280px"
                  className="object-cover"
                  priority
                />
              ) : null}
            </div>
          </Reveal>
        )}

        {/* Tech stack */}
        {project.tech.length > 0 && (
          <Reveal delay={0.15} width="100%">
            <div className="mb-8 md:mb-12">
              <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">{t('techStack')}</h2>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((item) => (
                  <span
                    key={item}
                    className="text-xs font-semibold text-text-main bg-background/70 border border-border/50 rounded-lg px-3 py-1.5 hover:border-cyan-500/40 transition-colors"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* Content (bilingual markdown) */}
        {project.content?.[loc] && (
          <Reveal delay={0.2} width="100%">
            <div className="relative p-5 sm:p-8 md:p-12 bg-background/70 border border-border/40 rounded-xl overflow-hidden w-full min-w-0">
              <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-6">{t('overview')}</h2>
              <div className="markdown-body prose prose-sm md:prose-base prose-invert max-w-none w-full min-w-0 text-text-muted prose-headings:text-text-main prose-headings:tracking-tighter prose-strong:text-cyan-400 prose-code:text-indigo-400 prose-pre:bg-background/80 prose-pre:border prose-pre:border-border/40 prose-pre:overflow-x-auto prose-pre:rounded-lg prose-img:rounded-lg prose-img:max-w-full [&_pre]:overflow-x-auto [&_pre]:max-w-full [&_code]:break-words [&_a]:break-all [&_p]:break-words [&>h1:first-child]:hidden">
                <Markdown rehypePlugins={[rehypeSanitize]}>
                  {project.content[loc]}
                </Markdown>
              </div>
            </div>
          </Reveal>
        )}

        <HireMeBanner hireBannerContent={hireBannerContent} locale={locale} />
      </div>
    </section>
  );
}
