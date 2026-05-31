import { Reveal } from "@/components/ui/Reveal";
import { CodeText } from "@/components/ui/CodeText";
import { ClientGimmick } from "@/components/ui/ClientGimmick";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Project, Locale } from "@/types";

interface ProjectsProps {
  projects: Project[];
  locale: string;
}

export async function Projects({ projects, locale }: ProjectsProps) {
  const t = await getTranslations('projects');
  const loc = locale as Locale;

  if (projects.length === 0) return null;

  return (
    <section id="projects" className="section-padding bg-surface relative overflow-hidden">
      <ClientGimmick name="serviceCluster" />

      <div className="container-custom relative z-10">
        <Reveal>
          <div className="relative flex flex-col items-center md:items-start text-center md:text-left mb-6 md:mb-16 lg:mb-24">
            <h2 className="text-2xl font-bold tracking-tighter text-text-main md:text-5xl lg:text-6xl">
              <CodeText tag="h2" type="html">{t('title')}</CodeText>
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-cyan-500 to-indigo-500 mt-4 md:mt-6 rounded-full mx-auto md:mx-0"></div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {projects.slice(0, 3).map((project, idx) => (
            <Reveal key={project.id} delay={idx * 0.1} width="100%">
              <Link href={`/projects/${project.slug}`} className="block h-full">
              <div
                className="p-4 md:p-8 bg-background border border-border/40 rounded-xl hover:border-cyan-500/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer group h-full flex flex-col relative overflow-hidden"
              >
                <h3 className="text-base md:text-xl font-bold text-text-main group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors leading-snug tracking-tight">
                  <CodeText tag="h3">{project.name[loc]}</CodeText>
                </h3>

                <p className="text-xs md:text-sm text-text-muted/70 line-clamp-3 leading-relaxed mt-2 md:mt-3 flex-grow group-hover:text-text-muted transition-colors">
                  <CodeText type="js">{project.desc[loc]}</CodeText>
                </p>

                <div className="mt-auto pt-3 md:pt-5 border-t border-border/20 flex justify-between items-center">
                  <span className="text-xs font-semibold uppercase tracking-widest text-cyan-500 group-hover:translate-x-1 transition-transform duration-300">
                    {t('metadata.access')}
                  </span>
                  <div className="w-6 h-[2px] bg-cyan-500/40 group-hover:w-10 group-hover:bg-cyan-500 transition-all duration-300 rounded-full" />
                </div>
              </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3} width="100%">
          <div className="flex justify-center mt-6 md:mt-12">
            <Link
              href="/projects"
              className="group flex items-center gap-3 px-5 py-2.5 md:px-6 md:py-3 bg-surface/50 border border-indigo-500/30 rounded-lg hover:border-indigo-500 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-indigo-500/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider relative z-10">
                {t('cta')}
              </span>
              <ArrowRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-1 transition-transform relative z-10" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
